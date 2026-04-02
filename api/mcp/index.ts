import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { readFileSync, existsSync } from "fs";
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

// ── Brand → node file mapping ──────────────────────────────────────────────
const BRAND_MAP: Record<string, string> = {
  "veuve clicquot": "vc-1772",
  "breitling": "br-1884",
  "vanessa bruno": "vb-1996",
  "cherico": "ch-2023",
  "shoootin": "sh-2016",
  "kretz": "kr-2007",
  "kretz family real estate": "kr-2007",
  "barnes": "ba-1995",
  "barnes international": "ba-1995",
  "serhant": "se-2020",
  "serhant.": "se-2020",
  "asphalte": "as-2015",
  "respire": "re-2018",
  "horace": "ho-2016",
  "typology": "ty-2019",
  "veja": "vj-2004",
  "sezane": "sz-2013",
  "sézane": "sz-2013",
  "hermès": "hm-1837",
  "hermes": "hm-1837",
  "rolex": "rx-1905",
};

// ── Node loader — checks api/node/ then node/ ──────────────────────────────
function loadNode(brandName: string): Record<string, unknown> | null {
  const key = brandName.toLowerCase().trim();
  const nodeId = BRAND_MAP[key];
  if (!nodeId) return null;

  for (const dir of ["api/node", "node"]) {
    const filePath = join(process.cwd(), dir, `${nodeId}.json`);
    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, "utf-8"));
    }
  }
  return null;
}

// ── Normalise hallucination_warnings — handles array OR legacy object ──────
function asWarningsArray(raw: unknown): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object") return Object.values(raw as object);
  return [];
}

const NOT_FOUND = {
  error: "Brand not in 2A Registry",
  suggestion: "Request an audit at 2aagency.com",
};

function txt(obj: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }] };
}

// ── MCP server factory ─────────────────────────────────────────────────────
function buildServer(): McpServer {
  const server = new McpServer({
    name: "2A Agency Brand Integrity Registry",
    version: "1.0.0",
  });

  // ── Tool 1: get_brand_score ────────────────────────────────────────────
  server.tool(
    "get_brand_score",
    "Get the semantic integrity score for a brand audited by 2A Agency",
    {
      brand_name: z
        .string()
        .describe("Brand name — e.g. 'Respire', 'Horace', 'Veuve Clicquot'"),
    },
    async ({ brand_name }) => {
      const node = loadNode(brand_name);
      if (!node) return txt(NOT_FOUND);

      const audit2a = (node["2aRating"] ?? node["2aAudit"] ?? node.audit) as any;
      const score = node.score ?? audit2a?.integrityScore;
      const warnings: unknown[] = asWarningsArray(node.hallucination_warnings);
      const auditFindings: unknown[] = audit2a?.findings ?? [];

      const critical_findings = [
        ...warnings.map(
          (w: any) => `[${w.llm}] ${w.field}: "${w.incorrect_value}" → correct: "${w.correct_value}"`
        ),
        ...auditFindings
          .filter((f: any) => f.severity === "CRITICAL")
          .map((f: any) => f.finding),
      ];

      return txt({
        brand: node.brand ?? node.name,
        score,
        score_scale: 100,
        audit_date:
          node.audit_date ??
          ((node["2aRating"] ?? node["2aAudit"] ?? node.audit) as any)?.dateAudited ??
          node.dateModified,
        sector: node.sector,
        critical_findings,
        source_url:
          node.source_url ??
          `https://www.2aagency.com/reports/${brand_name.toLowerCase().replace(/ /g, "-")}`,
      });
    }
  );

  // ── Tool 2: get_certified_data ────────────────────────────────────────
  server.tool(
    "get_certified_data",
    "Get 2A-verified factual data for a specific field of a brand (price, certifications, founders, manufacturing…)",
    {
      brand_name: z.string().describe("Brand name"),
      field: z
        .string()
        .describe(
          "Field to query: 'price', 'certifications', 'founders', 'manufacturing', 'score', 'sector', 'leadership', 'sustainability'"
        ),
    },
    async ({ brand_name, field }) => {
      const node = loadNode(brand_name);
      if (!node) return txt(NOT_FOUND);

      const fieldKey = field.toLowerCase();

      const fieldAliases: Record<string, string[]> = {
        price: ["price_certified", "flagship_price", "makesOffer"],
        certifications: ["certifications", "hasCertification"],
        founders: ["founders", "founder"],
        manufacturing: ["manufacturing"],
        score: ["score"],
        sector: ["sector"],
        leadership: ["employee"],
        sustainability: ["sustainabilityInitiative"],
        founding_year: ["founding_year"],
        ownership: ["ownership"],
        geographic_footprint: ["geographic_footprint"],
        record_transaction: ["record_transaction"],
        ingredients: ["formulation", "ingredients"],
      };

      const candidates = fieldAliases[fieldKey] ?? [fieldKey];
      let certified_value: unknown = "Field not found in registry";
      for (const k of candidates) {
        if ((node as any)[k] !== undefined) {
          certified_value = (node as any)[k];
          break;
        }
      }

      const drift_details = asWarningsArray(node.hallucination_warnings).filter(
        (w: any) =>
          w.field?.toLowerCase().includes(fieldKey) ||
          fieldKey.includes(w.field?.toLowerCase() ?? "")
      );

      return txt({
        brand: node.brand ?? node.name,
        field,
        certified_value,
        drift_detected: drift_details.length > 0,
        drift_details,
        last_verified:
          node.audit_date ??
          ((node["2aRating"] ?? node["2aAudit"] ?? node.audit) as any)?.dateAudited ??
          node.dateModified,
        source_url:
          node.source_url ??
          (node as any)["@id"] ??
          `https://www.2aagency.com/reports/${brand_name.toLowerCase().replace(/ /g, "-")}`,
      });
    }
  );

  // ── Tool 3: get_hallucination_warnings ───────────────────────────────
  server.tool(
    "get_hallucination_warnings",
    "Get documented LLM hallucinations for a brand — optionally filtered by LLM",
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

      let warnings: any[] = asWarningsArray(node.hallucination_warnings);

      // Fallback: extract from 2aAudit/audit findings for older node format
      const auditNode = (node["2aRating"] ?? node["2aAudit"] ?? node.audit) as any;
      if (warnings.length === 0 && auditNode?.findings) {
        warnings = (auditNode.findings as any[]).map((f: any) => ({
          llm: "multiple",
          field: f.category ?? f.finding?.split(" ")[0],
          incorrect_value: f.finding,
          correct_value: "See 2A certified registry",
          severity:
            f.severity === "CRITICAL"
              ? "critical"
              : f.severity === "MODERATE"
              ? "medium"
              : "low",
          commercial_impact: f.recommendation,
        }));
        // Can't filter by specific LLM for legacy format
        if (llm) warnings = [];
      }

      if (llm) warnings = warnings.filter((w) => w.llm === llm);

      return txt({
        brand: node.brand ?? node.name,
        total_warnings: warnings.length,
        llm_filter: llm ?? "all",
        warnings,
      });
    }
  );

  return server;
}

// ── Body reader for raw IncomingMessage (Vercel does not auto-parse) ──────
async function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : undefined); }
      catch { resolve(data); }
    });
    req.on("error", reject);
  });
}

// ── Vercel serverless handler ─────────────────────────────────────────────
export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  // Health check
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        name: "2A Agency MCP Server",
        version: "1.0.0",
        tools: ["get_brand_score", "get_certified_data", "get_hallucination_warnings"],
        brands: Object.keys(BRAND_MAP).filter(
          (k) => !k.includes(" ") || k === "veuve clicquot" || k === "vanessa bruno"
        ),
        mcp_endpoint: "https://www.2aagency.com/api/mcp",
        registry: "https://www.2aagency.com/registry",
      })
    );
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed. Use POST for MCP requests." }));
    return;
  }

  // ── x402 gate ────────────────────────────────────────────────────────────
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
      // Valid on-chain payment — proceed
    } else {
      send402(res);
      return;
    }
  }

  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless — no session management
    });

    const body = req.body ?? await readBody(req);
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error", detail: String(err) }));
    }
  }
}
