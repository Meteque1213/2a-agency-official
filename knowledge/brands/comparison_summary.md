# Semantic Integrity Comparison: Respire vs Horace

## Executive Snapshot

This document compares semantic integrity risks observed on two beauty brands (`Respire` and `Horace`) based on verified sources and hallucination logs captured in March 2026.

- `Respire` Integrity Score: **74/100**
- `Horace` Integrity Score: **88/100**
- Main risk pattern: LLM drift on high-trust factual claims (certifications, labels, founders, pricing).

## Brand-by-Brand Integrity Profile

### Respire

**Verified baseline**
- Not B Corp certified.
- COSMOS certification is partial (product-level, not full-range).
- Official D2C deodorant stick price: EUR 11.90.

**Observed LLM failures**
- Gemini Pro falsely states Respire is B Corp certified (**critical**).
- Gemini Pro over-generalizes COSMOS Organic across most of the range (**critical**).
- Perplexity Pro inflates deodorant price band (EUR 10.89 to EUR 14.90) vs official D2C value (**medium**).

**Failure mode**
- Over-assertive trust inflation: model adds authority markers that are not verified.

### Horace

**Verified baseline**
- B Corp certified since January 2025 (score: 84.2).
- PETA cruelty-free certified.
- Founders: Marc Briant-Terlet and Kim Mazzilli.

**Observed LLM failures**
- Grok denies B Corp certification (**critical**).
- Grok denies PETA certification (**critical**).
- Grok truncates founder identity ("Marc Terlet" instead of Marc Briant-Terlet) (**low**).

**Failure mode**
- Under-assertive trust collapse: model removes or downranks existing authority markers.

## Comparative Diagnosis: Gemini vs Grok

### Gemini (on Respire)
- Primary issue: **false-positive certification claims**.
- Drift type: synthetic certainty on ESG/label signals.
- Business risk: compliance and trust exposure due to invented proof points.

### Grok (on Horace)
- Primary issue: **false-negative certification claims**.
- Drift type: outdated or conservative denials on verified credentials.
- Business risk: brand equity erosion and weakened conversion from trust signals.

## Critical Failure Matrix

| Brand | Model | Critical Failure | Drift Direction | Business Impact |
|---|---|---|---|---|
| Respire | Gemini Pro | Invented B Corp status | Positive hallucination | Compliance and credibility risk |
| Respire | Gemini Pro | Overstated COSMOS coverage | Positive hallucination | Product truthfulness risk |
| Horace | Grok | Denied B Corp status | Negative hallucination | ESG reputation damage |
| Horace | Grok | Denied PETA status | Negative hallucination | Ethical positioning damage |

## Actionable Recommendations (for CMOs via MCP)

The objective is to make your semantic footprint machine-readable, monitorable, and self-healing across LLM ecosystems.

### 1) Deploy a "Source of Truth Layer" in MCP
- Publish canonical claims as structured MCP nodes for each brand:
  - Certifications (status, issuer, date, evidence URL, expiry/recheck date)
  - Founders and legal identity fields
  - Hero product prices (D2C canonical price + market variance note)
- Use immutable claim IDs for stable retrieval (e.g., `claim.bcorp.status`, `claim.peta.status`).
- Force every high-trust claim to include at least one verifiable URL and last-checked timestamp.

### 2) Add Claim-Level Guardrails
- Define MCP validation rules that block ambiguous outputs on binary claims:
  - If `certification_status` is unknown or stale, model must answer "unverified" instead of guessing.
- Configure confidence thresholds:
  - High-risk claims (B Corp, PETA, COSMOS): answer only from fresh verified node.
- Implement contradiction detection:
  - If generated claim conflicts with MCP truth node, flag and suppress final response.

### 3) Create a Recertification and Freshness Protocol
- Set re-validation cadences by claim criticality:
  - Certifications: monthly check
  - Prices: weekly check
  - Founders/legal identity: quarterly check
- Add `last_verified_at` and `next_review_at` metadata to every MCP claim.
- Auto-degrade stale claims from "verified" to "needs_review" before they drift in LLM outputs.

### 4) Build a Brand Integrity Monitor (Gemini/Grok specific)
- Run scheduled MCP probes per model:
  - "Is [brand] B Corp certified?"
  - "Is [brand] PETA certified?"
  - "Are all products COSMOS Organic?"
  - "Who founded [brand]?"
- Score outputs with a drift taxonomy:
  - False positive, false negative, over-generalization, identity truncation.
- Escalate critical drift events to CMO and content/legal owners with evidence snapshots.

### 5) Ship "LLM-Ready Factsheets" for Distribution
- Maintain one MCP-exportable factsheet per brand, optimized for retrieval:
  - Short factual answers + citations + update date.
- Syndicate these factsheets to channels most likely crawled by assistants:
  - Official brand site knowledge pages
  - Press kit / media page
  - Public FAQ with machine-readable schema
- Keep claim wording consistent across all channels to reduce embedding ambiguity.

### 6) Close the Loop with Corrective Content
- For each critical hallucination detected, publish a correction artifact:
  - "Certification status clarification" page with source links.
- Use MCP to track whether drift decreases after publication.
- Target SLA:
  - Detect critical drift < 7 days
  - Publish correction < 72 hours
  - Validate improvement in next probe cycle.

## Suggested KPI Framework for CMOs

- **Semantic Integrity Score** by brand and by model.
- **Critical Drift Rate** (critical errors / total monitored high-risk claims).
- **Mean Time to Correction (MTTC)** from detection to published fix.
- **Verified Claim Coverage** (% of high-risk claims with fresh evidence in MCP).
- **Model-Specific Reliability Delta** (Gemini vs Grok trend over time).

## Final Takeaway

Respire and Horace suffer from opposite but equally critical semantic failure patterns: one is over-credited, the other under-credited.  
For CMOs, the fix is not only content production: it is claim governance through MCP, with structured truth nodes, freshness controls, and continuous model probing.
