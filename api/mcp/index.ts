import type { IncomingMessage, ServerResponse } from "http";
import { BRAND_INDEX } from "./brand-data.js";


const TOOLS = [
  {
    name: "get_brand_score",
    description: "Get the semantic integrity score (0-100) for a brand audited by 2A Agency",
    inputSchema: {
      type: "object",
      properties: {
        brand_name: { type: "string", description: "Brand name — e.g. 'Hermès', 'Delvaux'" }
      },
      required: ["brand_name"]
    }
  },
  {
    name: "get_certified_data",
    description: "Get 2A-verified factual data for a brand: price, group, manufacturing, RSE",
    inputSchema: {
      type: "object",
      properties: {
        brand_name: { type: "string", description: "Brand name" }
      },
      required: ["brand_name"]
    }
  },
  {
    name: "get_hallucination_warnings",
    description: "Get documented LLM hallucinations for a brand",
    inputSchema: {
      type: "object",
      properties: {
        brand_name: { type: "string", description: "Brand name" },
        llm: {
          type: "string",
          enum: ["gemini", "chatgpt", "grok", "perplexity"],
          description: "Filter by LLM (optional)"
        }
      },
      required: ["brand_name"]
    }
  }
];

const NOT_FOUND = {
  error: "Brand not in 2A Registry",
  suggestion: "Request an audit at 2aagency.com"
};

function loadNode(brandName: string) {
  const key = brandName.toLowerCase().trim();
  return (BRAND_INDEX as any)[key] ?? null;
}

function txt(obj: unknown) {
  return { content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] };
}

function callTool(name: string, args: any) {
  if (name === "get_brand_score") {
    const node = loadNode(args.brand_name);
    if (!node) return txt(NOT_FOUND);
    const warnings = Array.isArray(node.hallucination_warnings)
      ? node.hallucination_warnings.filter((w: any) => w.severity === "critical")
      : [];
    return txt({
      brand: node.brand,
      integrity_score: node.integrity_score,
      sector: node.sector,
      audit_date: node.audit_date,
      rated_by: node.rated_by,
      llm_scores: node.llm_scores,
      critical_findings: warnings.map((w: any) =>
        `[${w.llm}] ${w.field}: "${w.incorrect}" → correct: "${w.correct}"`
      ),
      source_url: `https://www.2aagency.com/reports/${args.brand_name.toLowerCase().replace(/ /g, "-")}`
    });
  }

  if (name === "get_certified_data") {
    const node = loadNode(args.brand_name);
    if (!node) return txt(NOT_FOUND);
    return txt({
      brand: node.brand,
      sector: node.sector,
      founded: node.founded,
      integrity_score: node.integrity_score,
      audit_date: node.audit_date,
      certified_data: node.certified_data
    });
  }

  if (name === "get_hallucination_warnings") {
    const node = loadNode(args.brand_name);
    if (!node) return txt(NOT_FOUND);
    let warnings = Array.isArray(node.hallucination_warnings)
      ? node.hallucination_warnings
      : [];
    if (args.llm) warnings = warnings.filter((w: any) => w.llm === args.llm);
    return txt({
      brand: node.brand,
      integrity_score: node.integrity_score,
      total_warnings: warnings.length,
      llm_filter: args.llm ?? "all",
      warnings
    });
  }

  return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
}

async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { resolve({}); }
    });
    req.on("error", reject);
  });
}

function jsonResponse(res: ServerResponse, status: number, body: unknown) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key, x-payment"
  });
  res.end(json);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key, x-payment"
    });
    res.end();
    return;
  }

  // Health check
  if (req.method === "GET") {
    const brands = Object.keys(BRAND_INDEX as any).sort();
    jsonResponse(res, 200, {
      name: "2A Agency MCP Server",
      version: "1.0.0",
      tools: TOOLS.map(t => t.name),
      brands_count: brands.length,
      brands,
      mcp_endpoint: "https://www.2aagency.com/api/mcp",
      registry: "https://www.2aagency.com/registry"
    });
    return;
  }

  if (req.method !== "POST") {
    jsonResponse(res, 405, { error: "Method not allowed" });
    return;
  }

  const body = await readBody(req);
  const { method, params, id } = body;

  // JSON-RPC helpers
  const reply = (result: unknown) =>
    jsonResponse(res, 200, { jsonrpc: "2.0", id, result });
  const error = (code: number, message: string) =>
    jsonResponse(res, 200, { jsonrpc: "2.0", id, error: { code, message } });

  // MCP handshake — no auth required
  if (method === "initialize") {
    return reply({
      protocolVersion: "2025-03-26",
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "2A Agency Brand Integrity Registry", version: "1.0.0" }
    });
  }

  if (method === "notifications/initialized") {
    res.writeHead(204); res.end(); return;
  }

  if (method === "tools/list") {
    return reply({ tools: TOOLS });
  }

  if (method === "ping") {
    return reply({});
  }

  if (method === "tools/call") {
    const toolName = params?.name;
    const toolArgs = params?.arguments ?? {};
    if (!toolName) return error(-32602, "Missing tool name");
    const result = callTool(toolName, toolArgs);
    return reply(result);
  }

  return error(-32601, `Method not found: ${method}`);
}
