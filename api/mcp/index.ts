import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import type { IncomingMessage, ServerResponse } from "http";

// ── x402 Payment gate ──────────────────────────────────────────────────────
const FREE_API_KEYS = [
  process.env.FREE_API_KEY_DEMO,
  process.env.FREE_API_KEY_HERMES,
  process.env.FREE_API_KEY_ROLEX,
].filter(Boolean) as string[];

function buildX402Payload() {
  return {
    version: "1",
    scheme: "exact",
    network: "base",
    maxAmountRequired: "1000", // 0.001 USDC in atomic units (6 decimals)
    resource: "https://www.2aagency.com/api/mcp",
    description: "2A Agency Brand Semantic Registry — $0.001 per query",
    mimeType: "application/json",
    payTo: process.env.WALLET_ADDRESS ?? "",
    requiredDeadlineSeconds: 300,
    asset: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC on Base
  };
}

function send402(res: ServerResponse): void {
  const payload = buildX402Payload();
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64");
  res.writeHead(402, {
    "Content-Type": "application/json",
    "X-Payment-Required": encoded,
    "Access-Control-Expose-Headers": "X-Payment-Required",
  });
  res.end(
    JSON.stringify({
      error: "Payment required",
      x402: true,
      description: payload.description,
      price: "$0.001 USDC on Base",
      how: "Include 'x-payment' header with payment proof, or use a free API key via 'x-api-key' header",
    })
  );
}

async function verifyPayment(paymentHeader: string): Promise<boolean> {
  try {
    const resp = await fetch("https://services.ampersend.ai/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: paymentHeader,
        payload: buildX402Payload(),
      }),
    });
    if (!resp.ok) return false;
    const result = (await resp.json()) as { valid?: boolean; isValid?: boolean };
    return result.valid === true || result.isValid === true;
  } catch {
    return false;
  }
}

// ── Dynamic brand index built from node/*.json ─────────────────────────────
// Cached at module level — reused across warm invocations in Vercel
let brandIndex: Map<string, string> | null = null;

function getBrandIndex(): Map<string, string> {
  if (brandIndex) return brandIndex;

  brandIndex = new Map();

  for (const dir of ["node", "api/node"]) {
    const dirPath = join(process.cwd(), dir);
    if (!existsSync(dirPath)) continue;

    let files: string[];
    try {
      files = readdirSync(dirPath).filter((f) => f.endsWith(".json"));
    } catch {
      continue;
    }

    for (const file of files) {
      try {
        const filePath = join(dirPath, file);
        const content = JSON.parse(readFileSync(filePath, "utf-8")) as {
          brand?: string;
          name?: string;
        };
        const label = typeof content.brand === "string"
          ? content.brand
          : typeof content.name === "string"
          ? content.name
          : null;
        if (label) {
          brandIndex.set(label.toLowerCase(), filePath);
        }
      } catch {
        // skip malformed file
      }
    }
  }

  return brandIndex;
}

function loadNode(brandName: string): Record<string, unknown> | null {
  const index = getBrandIndex();
  const key = brandName.toLowerCase().trim();
  const filePath = index.get(key);
  if (!filePath) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
const NOT_FOUND = {
  error: "Brand not in 2A Registry",
  suggestion: "Request an audit at 2aagency.com",
};

function txt(obj: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }],
  };
}

// ── MCP server factory ─────────────────────────────────────────────────────
function buildServer(): McpServer {
  const server = new McpServer({
    name: "2A Agency Brand Integrity Registry",
    version: "1.0.0",
  });

  // ── Tool 1: get_brand_score ──────────────────────────────────────────────
  server.tool(
    "get_brand_score",
    "Get the semantic integrity score (0-100) for a brand audited by 2A Agency",
    {
      brand_name: z
        .string()
        .describe("Brand name — e.g. 'Hermès', 'Rolex', 'Delvaux'"),
    },
    async ({ brand_name }) => {
      const node = loadNode(brand_name);
      if (!node) return txt(NOT_FOUND);

      const warnings = Array.isArray(node.hallucination_warnings)
        ? (node.hallucination_warnings as any[])
        : [];

      const critical_findings = warnings
        .filter((w) => w.severity === "critical")
        .map(
          (w) =>
            `[${w.llm}] ${w.field}: "${w.incorrect}" → correct: "${w.correct}"`
        );

      const label = (node.brand ?? node.name) as string;
      return txt({
        brand: label,
        integrity_score: node.integrity_score,
        score_scale: 100,
        sector: node.sector,
        audit_date: node.audit_date,
        rated_by: node.rated_by,
        llm_scores: node.llm_scores,
        critical_findings,
        source_url: `https://www.2aagency.com/reports/${(brand_name as string)
          .toLowerCase()
          .replace(/ /g, "-")}`,
      });
    }
  );

  // ── Tool 2: get_certified_data ───────────────────────────────────────────
  server.tool(
    "get_certified_data",
    "Get 2A-verified factual data for a brand: price, group, manufacturing country, e-commerce, RSE certifications",
    {
      brand_name: z.string().describe("Brand name — e.g. 'Delvaux', 'Chanel'"),
    },
    async ({ brand_name }) => {
      const node = loadNode(brand_name);
      if (!node) return txt(NOT_FOUND);

      return txt({
        brand: node.brand ?? node.name,
        sector: node.sector,
        founded: node.founded,
        integrity_score: node.integrity_score,
        audit_date: node.audit_date,
        certified_data: node.certified_data,
      });
    }
  );

  // ── Tool 3: get_hallucination_warnings ───────────────────────────────────
  server.tool(
    "get_hallucination_warnings",
    "Get documented LLM hallucinations for a brand — optionally filtered by LLM (gemini, chatgpt, grok, perplexity)",
    {
      brand_name: z.string().describe("Brand name"),
      llm: z
        .enum(["gemini", "chatgpt", "grok", "perplexity"])
        .optional()
        .describe("Filter by LLM (optional). Omit to get all warnings."),
    },
    async ({ brand_name, llm }) => {
      const node = loadNode(brand_name);
      if (!node) return txt(NOT_FOUND);

      let warnings: any[] = Array.isArray(node.hallucination_warnings)
        ? (node.hallucination_warnings as any[])
        : [];

      if (llm) warnings = warnings.filter((w) => w.llm === llm);

      return txt({
        brand: node.brand ?? node.name,
        integrity_score: node.integrity_score,
        total_warnings: warnings.length,
        llm_filter: llm ?? "all",
        warnings,
      });
    }
  );

  return server;
}

// ── Body reader for raw IncomingMessage (Vercel does not auto-parse) ───────
async function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : undefined);
      } catch {
        resolve(data);
      }
    });
    req.on("error", reject);
  });
}

// ── Vercel serverless handler ──────────────────────────────────────────────
export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  // Health check — also exposes the full dynamic brand list
  if (req.method === "GET") {
    const index = getBrandIndex();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        name: "2A Agency MCP Server",
        version: "1.0.0",
        tools: [
          "get_brand_score",
          "get_certified_data",
          "get_hallucination_warnings",
        ],
        brands_count: index.size,
        brands: Array.from(index.keys()).sort(),
        mcp_endpoint: "https://www.2aagency.com/api/mcp",
        registry: "https://www.2aagency.com/registry",
      })
    );
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Method not allowed. Use POST for MCP requests." })
    );
    return;
  }

  // ── Read body first to inspect the MCP method ─────────────────────────────
  const body = req.body ?? (await readBody(req));
  const mcpMethod = (body as any)?.method as string | undefined;

  // ── x402 gate — free for handshake methods, paid for tools/call ───────────
  const FREE_METHODS = ["initialize", "notifications/initialized", "tools/list", "ping"];

  if (!FREE_METHODS.includes(mcpMethod ?? "")) {
    const apiKey = req.headers["x-api-key"] as string | undefined;
    if (apiKey && FREE_API_KEYS.includes(apiKey)) {
      // Free API key — bypass payment
    } else {
      const paymentHeader = req.headers["x-payment"] as string | undefined;
      if (paymentHeader) {
        const valid = await verifyPayment(paymentHeader);
        if (!valid) {
          send402(res);
          return;
        }
      } else {
        send402(res);
        return;
      }
    }
  }

  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless — no session management
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: "Internal server error", detail: String(err) })
      );
    }
  }
}
