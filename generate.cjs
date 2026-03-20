const fs = require('fs');
const path = require('path');

// --- UTILS ---
const escapeHtml = (str) => String(str || "")
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// --- CONFIG ---
const registry = JSON.parse(fs.readFileSync('registry.json', 'utf8'));
const outputDir = path.join(__dirname, 'public');
fs.mkdirSync(outputDir, { recursive: true });

let tableRows = "";
let sitemapUrls = "";
const slugCount = {};

// Trier par AI_IQ décroissant
const sortedRegistry = [...registry].sort((a, b) => (b.AI_IQ || 0) - (a.AI_IQ || 0));

// --- GENERATION ---
sortedRegistry.forEach(brand => {
    // PROTECTION CHIRURGICALE : On force en String pour éviter le crash .toLowerCase()
    const rawEntityName = String(brand.entity || "Unknown");
    
    // Gestion propre des Slugs et Collisions
    let slug = rawEntityName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    slugCount[slug] = (slugCount[slug] || 0) + 1;
    if (slugCount[slug] > 1) slug = `${slug}-${slugCount[slug]}`;
    
    const fileName = `${slug}.html`;
    const filePath = path.join(outputDir, fileName);
    const escapedEntity = escapeHtml(rawEntityName);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>2A AGENCY | ${escapedEntity} | ${brand.SOR_ID}</title>
    <meta name="description" content="AI Intelligence audit for ${escapedEntity} — Score: ${brand.AI_IQ}">
    <meta name="2a-sor-id" content="${brand.SOR_ID}">
    <meta name="2a-ai-iq" content="${brand.AI_IQ}">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#050505] text-white p-12 italic uppercase font-bold text-[11px]">
    <div style="display:none">SYSTEM_OF_RECORD_DATA_START ${JSON.stringify(brand)} SYSTEM_OF_RECORD_DATA_END</div>
    <nav class="mb-12 border-b border-white/10 pb-4"><a href="index.html" class="opacity-50 hover:opacity-100 italic tracking-widest text-[9px]">← BACK TO SYSTEM_OF_RECORD</a></nav>
    <main class="max-w-4xl">
        <h1 class="text-7xl font-black mb-4 tracking-tighter italic uppercase">${escapedEntity}</h1>
        <div class="flex gap-8 items-end italic">
            <div><p class="text-[9px] opacity-40 tracking-widest">AI IQ INDEX</p><p class="text-7xl text-emerald-500 font-black">${brand.AI_IQ}</p></div>
            <div><p class="text-[9px] opacity-40 tracking-widest">SOR_ID</p><p class="text-xl opacity-80">${brand.SOR_ID}</p></div>
        </div>
    </main>
</body>
</html>`;

    fs.writeFileSync(filePath, htmlContent);
    
    tableRows += `<tr class="border-b border-white/5 hover:bg-white/5 transition-colors font-bold italic">
        <td class="p-4 text-[12px] uppercase">${escapedEntity}</td>
        <td class="p-4 text-emerald-500 text-[14px]">${brand.AI_IQ}</td>
        <td class="p-4 opacity-40 text-[9px] font-mono tracking-tighter">${brand.SOR_ID}</td>
        <td class="p-4 text-right"><a href="${fileName}" class="border border-white/20 px-4 py-1 text-[9px] hover:bg-white hover:text-black transition-all italic tracking-widest">OPEN_AUDIT</a></td>
    </tr>`;
    sitemapUrls += `<url><loc>https://2a-agency-official.vercel.app/${fileName}</loc></url>\n`;
});

// --- INDEX.HTML ---
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>2A AGENCY | SYSTEM OF RECORD</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-[#050505] text-white p-8 md:p-20 italic uppercase font-bold">
    <header class="mb-20 border-b border-white/10 pb-10">
        <h1 class="text-5xl font-black tracking-tighter italic uppercase">2A AGENCY / SYSTEM OF RECORD</h1>
        <p class="opacity-40 text-[10px] tracking-[0.3em] mt-2">GLOBAL BRAND AI INTELLIGENCE REGISTRY [2026] — ${sortedRegistry.length} ENTITIES</p>
    </header>
    <table class="w-full text-left tracking-tight">
        <thead><tr class="opacity-30 border-b border-white/10 text-[9px] tracking-widest"><th class="p-4">ENTITY</th><th class="p-4">AI_IQ</th><th class="p-4">SOR_ID</th><th class="p-4 text-right">ACCESS</th></tr></thead>
        <tbody>${tableRows}</tbody>
    </table>
</body>
</html>`;
fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

// --- SITEMAP.XML ---
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://2a-agency-official.vercel.app/</loc></url>
${sitemapUrls}</urlset>`;
fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapXml);

console.log(`✅ ${sortedRegistry.length} reports, index and sitemap generated in /public`);