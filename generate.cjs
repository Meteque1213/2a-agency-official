const fs = require('fs');
const path = require('path');

// Utilitaire pour nettoyer les textes HTML
const escapeHtml = (str) => String(str || "")
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// Chargement de la base de données
const registry = JSON.parse(fs.readFileSync('registry.json', 'utf8'));
const outputDir = path.join(__dirname, 'public');
fs.mkdirSync(outputDir, { recursive: true });

// Copie du Whitepaper vers le dossier public
if (fs.existsSync('whitepaper.html')) {
    fs.copyFileSync('whitepaper.html', path.join(outputDir, 'whitepaper.html'));
}

let tableRows = "";
let sitemapUrls = "";
const slugCount = {};

registry.forEach(brand => {
    // --- EXTRACTION DES DONNÉES ---
    const entity = brand.entity || {};
    const financials = brand.financials || {};
    const strategy = brand.strategy || {};
    const governance = brand.governance || {};
    const cultural = brand.cultural_intelligence || {};

    const rawName = entity.name || brand.entity || "Unknown Entity";
    const iqScore = cultural.brand_heat_index?.value || brand.AI_IQ || "N/A";
    const sorId = brand["2a_id"] || brand.SOR_ID || "NO-ID";
    const moat = cultural.cultural_moat?.value || "Data pending certification.";

    // 1. Génération du bloc Ownership
    let ownershipHtml = "";
    (entity.ownership || []).forEach(o => {
        ownershipHtml += `<div class="mb-3 pb-2 border-b border-black/5"><p class="text-[10px] opacity-40 uppercase tracking-tighter">${o.entity}</p><p class="text-xs font-bold">${o.stake} Stake / ${o.voting_rights} Voting</p></div>`;
    });

    // 2. Génération du bloc Risques
    let risksHtml = "";
    (strategy.risks || []).forEach(r => {
        risksHtml += `<div class="p-2 mb-2 bg-red-50 border-l-2 border-red-500 text-[11px] font-medium text-red-900 uppercase italic">${escapeHtml(r.value)}</div>`;
    });

    // 3. Génération du bloc Timeline (Events)
    let eventsHtml = "";
    (brand.events || []).forEach(e => {
        eventsHtml += `<div class="mb-4"><p class="text-[#065f46] text-[10px] font-black italic uppercase">${e.year} | ${e.type.toUpperCase()}</p><p class="text-xs normal-case font-normal leading-tight">${escapeHtml(e.description)}</p></div>`;
    });

    // --- LOGIQUE DE NOM DE FICHIER (SLUG) ---
    let slug = String(rawName).toLowerCase().replace(/[^a-z0-9]/g, '-');
    slugCount[slug] = (slugCount[slug] || 0) + 1;
    if (slugCount[slug] > 1) slug = `${slug}-${slugCount[slug]}`;
    const fileName = `${slug}.html`;
    const filePath = path.join(outputDir, fileName);

    // --- TEMPLATE DU RAPPORT D'AUDIT ENRICHIE ---
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>${escapeHtml(rawName)} | AI IQ & Forensic Audit | 2A Agency</title>
    <meta name="description" content="Official 2A Agency Forensic Audit for ${escapeHtml(rawName)}. AI IQ Score: ${iqScore}. Strategic risk assessment, ownership structure, and cultural moat analysis.">
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "AnalysisNewsArticle",
      "headline": "Forensic Audit: ${escapeHtml(rawName)}",
      "author": { "@type": "Organization", "name": "2A Agency" },
      "datePublished": "2026-03-20",
      "description": "${escapeHtml(moat)}",
      "identifier": "${sorId}"
    }
    </script>

    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-black p-6 md:p-12 italic uppercase font-bold tracking-tight">
    <div style="display:none">SYSTEM_OF_RECORD_DATA_START ${JSON.stringify(brand)} SYSTEM_OF_RECORD_DATA_END</div>

    <nav class="mb-12 border-b border-black/10 pb-4 flex justify-between uppercase">
        <a href="index.html" class="opacity-50 hover:opacity-100 text-[9px]">← SYSTEM OF RECORD</a>
        <span class="text-[9px] opacity-30 italic font-normal uppercase">CERTIFIED PROTOCOL V1.2.9</span>
    </nav>

    <main class="max-w-6xl mx-auto">
        <header class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-b-4 border-black pb-12">
            <div class="md:col-span-2">
                <p class="text-[#065f46] text-[14px] mb-2 tracking-[0.3em] font-black italic uppercase">${escapeHtml(entity.category || "Luxury Portfolio")}</p>
                <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-[#065f46] uppercase leading-none mb-6">${escapeHtml(rawName)}</h1>
                <div class="flex gap-8 opacity-60 text-[10px] font-normal uppercase">
                    <p>SOR_ID: ${sorId}</p>
                    <p>CEO: ${governance.chairman_ceo?.name || "N/A"}</p>
                    <p>STRUCTURE: ${governance.structure || "N/A"}</p>
                </div>
            </div>
            <div class="bg-gray-50 p-8 border border-black/10 text-right flex flex-col justify-center">
                <p class="text-[11px] opacity-40 mb-1 font-normal tracking-widest uppercase">AI IQ INDEX</p>
                <p class="text-9xl text-[#065f46] font-black leading-none">${iqScore}</p>
            </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="space-y-10">
                <section>
                    <h3 class="text-[11px] text-[#065f46] mb-6 tracking-widest border-b border-[#065f46]/20 pb-2 uppercase">01. FINANCIALS</h3>
                    <div class="mb-6">
                        <p class="text-[10px] opacity-40 font-normal">ANNUAL REVENUE</p>
                        <p class="text-3xl font-black italic">${financials.annual_revenue?.value || "N/A"} <span class="text-xs opacity-50 font-normal">${financials.annual_revenue?.currency || ""}</span></p>
                    </div>
                    <div class="mb-6">
                        <p class="text-[10px] opacity-40 font-normal">MARKET CAP</p>
                        <p class="text-3xl font-black italic">${financials.market_cap?.value || "N/A"} <span class="text-xs opacity-50 font-normal">${financials.market_cap?.currency || ""}</span></p>
                    </div>
                </section>
                <section class="bg-emerald-50 p-4 border border-[#065f46]/20">
                    <h3 class="text-[11px] text-[#065f46] mb-4 tracking-widest uppercase">02. OWNERSHIP</h3>
                    ${ownershipHtml || "Direct control recorded."}
                </section>
            </div>

            <div class="md:col-span-2 space-y-12">
                <section>
                    <h3 class="text-[11px] text-[#065f46] mb-4 tracking-widest border-b border-[#065f46]/20 pb-2 uppercase">03. CULTURAL MOAT</h3>
                    <p class="text-xl font-medium normal-case font-normal leading-relaxed text-black/80 italic">${escapeHtml(moat)}</p>
                </section>
                <section>
                    <h3 class="text-[11px] text-[#065f46] mb-4 tracking-widest border-b border-[#065f46]/20 pb-2 uppercase">04. CORE STRATEGY</h3>
                    <p class="text-sm font-medium normal-case font-normal leading-relaxed italic">${escapeHtml(strategy.core?.value || "N/A")}</p>
                </section>
                <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-[11px] text-red-600 mb-4 tracking-widest uppercase italic font-black">Strategic Risks</h3>
                        ${risksHtml || "Low exposure risk."}
                    </div>
                    <div>
                        <h3 class="text-[11px] text-[#065f46] mb-4 tracking-widest uppercase italic font-black">Audit Timeline</h3>
                        ${eventsHtml || "No recent audit events logged."}
                    </div>
                </section>
            </div>

            <div class="bg-black text-white p-6 flex flex-col justify-between">
                <div>
                    <h3 class="text-[11px] text-[#10b981] mb-6 tracking-widest uppercase">05. PROOF</h3>
                    <p class="text-[10px] opacity-60 mb-1 font-normal uppercase">CONFIDENCE SCORE</p>
                    <p class="text-5xl font-black italic mb-8">${(brand.proof?.confidence_score * 100 || 0).toFixed(0)}%</p>
                    
                    <p class="text-[10px] opacity-60 mb-2 font-normal uppercase tracking-widest">SOURCES AUDITED</p>
                    ${(brand.proof?.sources || []).map(s => `<p class="text-[9px] mb-2 border-l border-[#10b981] pl-2 opacity-80 uppercase italic">${s.name}</p>`).join('')}
                </div>
                <div class="pt-6 border-t border-white/20">
                    <p class="text-[9px] font-normal normal-case leading-tight opacity-50 italic">Data anchored on Base (L2) blockchain via 2A Notarization Protocol.</p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>`;

    fs.writeFileSync(filePath, htmlContent);
    
    tableRows += `
    <tr class="border-b border-black/5 hover:bg-emerald-50 transition-all cursor-pointer group" onclick="window.location.href='${fileName}'">
        <td class="p-6 text-sm uppercase font-bold text-[#065f46]">${escapeHtml(rawName)}</td>
        <td class="p-6 text-[#065f46] text-2xl font-black tracking-tighter italic">${iqScore}</td>
        <td class="p-6 opacity-40 text-[10px] font-mono tracking-tighter text-black font-mono uppercase">${sorId}</td>
        <td class="p-6 text-right"><span class="border border-[#065f46]/30 text-[#065f46] text-[9px] px-3 py-1 group-hover:bg-[#065f46] group-hover:text-white transition-all italic tracking-widest uppercase">ACCESS_DATA</span></td>
    </tr>`;
    sitemapUrls += `<url><loc>https://2a-agency-official.vercel.app/${fileName}</loc></url>\n`;
});

// --- GÉNÉRATION DE L'INDEX ---
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2A AGENCY | SYSTEM OF RECORD</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-black p-6 md:p-20 italic uppercase font-bold">
    <header class="mb-16 border-b-4 border-[#065f46] pb-10 flex flex-col md:flex-row justify-between items-end uppercase">
        <div>
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter italic uppercase text-[#065f46] leading-none">2A AGENCY <br>SYSTEM OF RECORD</h1>
            <p class="opacity-40 text-[10px] tracking-[0.5em] mt-4 font-normal text-black uppercase">GLOBAL BRAND INTELLIGENCE REGISTRY • ${registry.length} ENTITIES</p>
        </div>
        
        <div class="flex gap-4 mt-8 md:mt-0 font-bold uppercase">
            <a href="whitepaper.html" class="bg-[#065f46] text-white text-[10px] px-6 py-3 tracking-widest hover:bg-black transition-all italic uppercase">READ_PROTOCOL</a>
            <a href="whitepaper.html#architecture" class="border border-[#065f46] text-[#065f46] text-[10px] px-6 py-3 tracking-widest hover:bg-emerald-50 transition-all italic uppercase">AGENCY_STRUCTURE</a>
        </div>
    </header>

    <main>
        <table class="w-full text-left uppercase">
            <thead class="opacity-30 text-[9px] tracking-widest border-b border-black/10 font-normal text-black uppercase">
                <tr><th class="p-6">ENTITY NAME</th><th class="p-6">AI_IQ</th><th class="p-6">SOR_ID</th><th class="p-6 text-right uppercase">STATUS</th></tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    </main>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://2a-agency-official.vercel.app/</loc></url>${sitemapUrls}</urlset>`;
fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapXml);

console.log(`✅ SUCCESS: Fully optimized System of Record deployed for ${registry.length} entities.`);