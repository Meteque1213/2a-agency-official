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
  },
  {
    name: "get_ecgt_flags",
    description: "Get ECGT (EU Green Claims Directive) exposure for a brand: sustainability claims, environmental certifications, and classification of drifts under Art. 2(1)(a/b/c). Returns partial data if brand has not been audited on ECGT angle specifically.",
    inputSchema: {
      type: "object",
      properties: {
        brand_name: { type: "string", description: "Brand name" }
      },
      required: ["brand_name"]
    }
  },
  {
    name: "search_registry",
    description: "Search the 2A registry by combined filters: group, sector, integrity score range. Returns paginated list of matching brands with key metadata.",
    inputSchema: {
      type: "object",
      properties: {
        group: { type: "string", description: "Filter by owning group — e.g. 'LVMH', 'Kering', 'Richemont', 'Independent' (case-insensitive partial match)" },
        sector: { type: "string", description: "Filter by sector — e.g. 'Haute Horlogerie', 'Luxe Maroquinerie' (case-insensitive partial match)" },
        integrity_score_min: { type: "number", description: "Minimum integrity score (0-100)" },
        integrity_score_max: { type: "number", description: "Maximum integrity score (0-100)" },
        limit: { type: "number", description: "Max results to return (default 20, max 100)" }
      },
      required: []
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

// --- Helpers for new tools ---

function extractGroup(node: any): string {
  // Try multiple field paths to extract the owning group
  const cd = node.certified_data || {};
  const raw = cd.group || node.ownership || node.parentOrganization?.name || node.group || "";
  const str = String(raw).toLowerCase();
  if (str.includes("lvmh")) return "LVMH";
  if (str.includes("kering")) return "Kering";
  if (str.includes("richemont")) return "Richemont";
  if (str.includes("swatch")) return "Swatch Group";
  if (str.includes("prada")) return "Prada Group";
  if (str.includes("tod")) return "Tod's Group";
  if (str.includes("otb")) return "OTB Group";
  if (str.includes("puig")) return "Puig";
  if (str.includes("ralph lauren")) return "Ralph Lauren Corp";
  if (str.includes("independ") || str.includes("indépend") || str.includes("bootstrapped") || str.includes("famille") || str.includes("family")) return "Independent";
  return raw ? String(raw) : "Unknown";
}

function extractSector(node: any): string {
  return node.sector || "Unknown";
}

function extractScore(node: any): number | null {
  const s = node.integrity_score ?? node.score ?? node["2aRating"]?.integrityScore ?? null;
  return typeof s === "number" ? s : null;
}

function extractBrandName(node: any): string {
  return node.brand || node.name || "Unknown";
}

function extractAuditDate(node: any): string | null {
  return node.audit_date || node.dateModified || node["2aRating"]?.dateRated || node["2aRating"]?.date || null;
}

function ecgtClassify(field: string, incorrect: string): string {
  // Classify a hallucination under ECGT Art. 2(1)(a/b/c) based on field and content
  const f = (field || "").toLowerCase();
  const inc = (incorrect || "").toLowerCase();

  // Art. 2(1)(a) — false environmental claim (fabricated certification or green credential)
  if (f.includes("certif") || f.includes("cosmos") || f.includes("b_corp") || f.includes("b corp") || f.includes("peta") || f.includes("bcorp")) {
    return "Art. 2(1)(a) — false environmental claim";
  }
  // Art. 2(1)(b) — misleading over-generalization
  if (f.includes("sustain") || f.includes("carbon") || f.includes("rse") || f.includes("environmental") || f.includes("durable") || f.includes("eco")) {
    if (inc.includes("100%") || inc.includes("majority") || inc.includes("fully") || inc.includes("intégral")) {
      return "Art. 2(1)(b) — misleading over-generalization";
    }
    return "Art. 2(1)(b) — environmental claim accuracy";
  }
  // Art. 2(1)(c) — unsubstantiated future commitment
  if (f.includes("target") || f.includes("neutral") || f.includes("2030") || f.includes("2050") || f.includes("sbti")) {
    return "Art. 2(1)(c) — unsubstantiated commitment";
  }
  return "Art. 2(1) — unclassified environmental drift";
}

function extractEcgtFlags(node: any): any {
  const warnings = Array.isArray(node.hallucination_warnings) ? node.hallucination_warnings : [];

  // Filter warnings that are ECGT-relevant (sustainability, certifications, environmental)
  const ecgtKeywords = ["sustain", "carbon", "certif", "rse", "environmental", "durable", "eco", "b_corp", "b corp", "peta", "cosmos", "neutral", "sbti", "vegan", "organic", "bio", "green", "ethic"];

  const ecgtRelevant = warnings.filter((w: any) => {
    const field = (w.field || "").toLowerCase();
    return ecgtKeywords.some(k => field.includes(k));
  });

  const criticalFlags = ecgtRelevant
    .filter((w: any) => w.severity === "critical")
    .map((w: any) => ({
      claim: w.field,
      llm_source: w.llm || "unknown",
      incorrect: w.incorrect || w.incorrect_value,
      correct: w.correct || w.correct_value,
      legal_category: ecgtClassify(w.field, w.incorrect || w.incorrect_value || ""),
      severity: w.severity,
      commercial_impact: w.commercial_impact || null,
      pattern: w.pattern || null
    }));

  const atRiskFlags = ecgtRelevant
    .filter((w: any) => w.severity === "medium" || w.severity === "moderate")
    .map((w: any) => ({
      claim: w.field,
      llm_source: w.llm || "unknown",
      incorrect: w.incorrect || w.incorrect_value,
      correct: w.correct || w.correct_value,
      legal_category: ecgtClassify(w.field, w.incorrect || w.incorrect_value || ""),
      severity: w.severity
    }));

  // Detect absent sustainability programs from audit findings
  const absentPrograms: any[] = [];
  const auditFindings = node.audit?.findings || [];
  for (const f of auditFindings) {
    const cat = (f.category || "").toLowerCase();
    const find = (f.finding || "").toLowerCase();
    if (cat.includes("durab") || cat.includes("sustain") || find.includes("ecoyellow") || find.includes("ecologique")) {
      absentPrograms.push({
        name: f.finding?.match(/[A-Z][a-zA-Z]+/)?.[0] || "Program",
        description: f.finding,
        severity: f.severity
      });
    }
  }

  // Determine overall ECGT status
  let ecgt_status = "not_audited";
  const rseCerts = node.certified_data?.rse_certifications || node.certified_data?.rse || node.certifications;
  const hasEcgtData = criticalFlags.length > 0 || atRiskFlags.length > 0 || absentPrograms.length > 0 || rseCerts;

  if (hasEcgtData) {
    if (criticalFlags.length > 0) ecgt_status = "at_risk";
    else if (atRiskFlags.length > 0) ecgt_status = "monitored";
    else ecgt_status = "compliant";
  }

  return {
    ecgt_status,
    critical_flags: criticalFlags,
    at_risk_flags: atRiskFlags,
    absent_programs: absentPrograms,
    certifications_declared: rseCerts || null
  };
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
      source_url: `https://www.2aagency.com/reports/${args.brand_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-")}`
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

  if (name === "get_ecgt_flags") {
    const node = loadNode(args.brand_name);
    if (!node) return txt(NOT_FOUND);
    const ecgt = extractEcgtFlags(node);
    const brandSlug = (args.brand_name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-");
    return txt({
      brand: extractBrandName(node),
      directive: "EU 2024/825 (Empowering Consumers for the Green Transition)",
      enforcement_date: "2026-09-27",
      audit_date: extractAuditDate(node),
      ecgt_status: ecgt.ecgt_status,
      critical_flags: ecgt.critical_flags,
      at_risk_flags: ecgt.at_risk_flags,
      absent_programs: ecgt.absent_programs,
      certifications_declared: ecgt.certifications_declared,
      scope_notice: ecgt.ecgt_status === "not_audited"
        ? "This brand has not been specifically audited for ECGT compliance. Data shown is derived from the general 2A registry audit. A dedicated ECGT audit is recommended."
        : "ECGT exposure derived from 2A registry audit. For a formal ECGT dossier with remediation roadmap, contact 2A Agency.",
      full_dossier_url: `https://www.2aagency.com/reports/${brandSlug}`
    });
  }

  if (name === "search_registry") {
    const allBrands = Object.keys(BRAND_INDEX as any);
    const groupFilter = args.group ? String(args.group).toLowerCase() : null;
    const sectorFilter = args.sector ? String(args.sector).toLowerCase() : null;
    const scoreMin = typeof args.integrity_score_min === "number" ? args.integrity_score_min : 0;
    const scoreMax = typeof args.integrity_score_max === "number" ? args.integrity_score_max : 100;
    const limit = Math.min(typeof args.limit === "number" ? args.limit : 20, 100);

    const matches: any[] = [];
    for (const key of allBrands) {
      const node = (BRAND_INDEX as any)[key];
      if (!node) continue;

      const brandName = extractBrandName(node);
      const group = extractGroup(node);
      const sector = extractSector(node);
      const score = extractScore(node);

      // Apply filters
      if (groupFilter && !group.toLowerCase().includes(groupFilter)) continue;
      if (sectorFilter && !sector.toLowerCase().includes(sectorFilter)) continue;
      if (score !== null) {
        if (score < scoreMin || score > scoreMax) continue;
      } else {
        // If no score available and a score filter is active, skip
        if (args.integrity_score_min !== undefined || args.integrity_score_max !== undefined) continue;
      }

      const brandSlug = brandName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-");
      matches.push({
        brand: brandName,
        sector,
        group,
        integrity_score: score,
        audit_date: extractAuditDate(node),
        registry_url: `https://www.2aagency.com/reports/${brandSlug}`
      });
    }

    // Sort by integrity_score descending (nulls last)
    matches.sort((a, b) => {
      if (a.integrity_score === null && b.integrity_score === null) return 0;
      if (a.integrity_score === null) return 1;
      if (b.integrity_score === null) return -1;
      return b.integrity_score - a.integrity_score;
    });

    const returned = matches.slice(0, limit);
    return txt({
      total_matches: matches.length,
      returned: returned.length,
      limit,
      filters_applied: {
        group: args.group ?? null,
        sector: args.sector ?? null,
        integrity_score_min: args.integrity_score_min ?? null,
        integrity_score_max: args.integrity_score_max ?? null
      },
      results: returned
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
      version: "1.1.0",
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
      serverInfo: { name: "2A Agency Brand Integrity Registry", version: "1.1.0" }
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
