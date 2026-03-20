const fs = require('fs');
const path = require('path');

const escapeHtml = (str) => String(str || "")
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const registry = JSON.parse(fs.readFileSync('registry.json', 'utf8'));
const outputDir = path.join(__dirname, 'public');
fs.mkdirSync(outputDir, { recursive: true });

let tableRows = "";
let sitemapUrls = "";
const slugCount = {};

registry.forEach(brand => {
    // EXTRACTION SÉCURISÉE
    const rawName = brand.entity?.name || brand.entity || "Unknown Entity";
    const iqScore = brand.cultural_intelligence?.brand_heat_index?.value || brand.AI_IQ || "N/A";
    const sorId = brand["2a_id"] || brand.SOR_ID || "NO-ID";
    const category = brand.entity?.category || "Luxury Portfolio";
    
    let slug = String(rawName).toLowerCase().replace(/[^a-z0-9]/g, '-');
    slugCount[slug] = (slugCount[slug] || 0) + 1;
    if (slugCount[slug] > 1) slug = `${slug}-${slugCount[slug]}`;
    
    const fileName = `${slug}.html`;
    const filePath = path.join(outputDir, fileName);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>2A AGENCY | ${escapeHtml(rawName)}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #050505; color: white; font-family: ui-sans-serif, system-ui, sans-serif; }
        .text-emerald { color: #10b981; }
    </style>
</head>
<body class="p-8 md:p-20 italic uppercase font-bold">
    <div style="display:none">SYSTEM_OF_RECORD_DATA_START ${JSON.stringify(brand)} SYSTEM_OF_RECORD_DATA_END</div>
    <nav class="mb-12 border-b border-white/10 pb-4">
        <a href="index.html" class="text-[10px] opacity-50 tracking-widest hover:opacity-100">← SYSTEM OF RECORD</a>
    </nav>
    <main class="max-w-5xl">
        <p class="text-emerald text-[12px] mb-2 tracking-[0.3em]">${escapeHtml(category)}</p>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase">${escapeHtml(rawName)}</h1>
        <div class="grid grid-cols-2 gap-12 border-t border-white/10 pt-8">
            <div>
                <p class="text-[10px] opacity-40 mb-2">AI IQ INDEX</p>
                <p class="text-7xl md:text-9xl text-emerald font-black leading-none">${iqScore}</p>
            </div>
            <div class="text-right flex flex-col justify-end">
                <p class="text-[10px] opacity-40 mb-1">SOR_ID</p>
                <p class="text-xl md:text-2xl mb-6">${sorId}</p>
                <p class="text-[10px] opacity-40 mb-1">PROTOCOL</p>
                <p class="text-sm">${brand["2a_protocol"] || "V1.2"}</p>
            </div>
        </div>
    </main>
</body>
</html>`;

    fs.writeFileSync(filePath, htmlContent);
    
    tableRows += `
    <tr class="border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer group" onclick="window.location.href='${fileName}'">
        <td class="p-6 text-sm tracking-tighter uppercase font-bold text-white/90">${escapeHtml(rawName)}</td>
        <td class="p-6 text-emerald text-2xl font-black tracking-tighter">${iqScore}</td>
        <td class="p-6 opacity-30 text-[10px] font-mono tracking-tighter">${sorId}</td>
        <td class="p-6 text-right"><span class="border border-emerald-500/30 text-emerald text-[9px] px-3 py-1 group-hover:bg-emerald-500 group-hover:text-black transition-all">OPEN_AUDIT</span></td>
    </tr>`;
    sitemapUrls += `<url><loc>https://2a-agency-official.vercel.app/${fileName}</loc></url>\n`;
});

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>2A AGENCY | SYSTEM OF RECORD</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#050505] text-white p-6 md:p-20 italic uppercase font-bold">
    <header class="mb-16 border-b border-white/10 pb-10">
        <h1 class="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">2A AGENCY <span class="text-emerald">/</span> SYSTEM OF RECORD</h1>
        <p class="opacity-40 text-[10px] tracking-[0.5em] mt-4">GLOBAL BRAND INTELLIGENCE REGISTRY • ${registry.length} ENTITIES</p>
    </header>
    <table class="w-full text-left">
        <thead class="opacity-20 text-[9px] tracking-widest border-b border-white/10 uppercase">
            <tr><th class="p-6">ENTITY NAME</th><th class="p-6">AI_IQ</th><th class="p-6">SOR_ID</th><th class="p-6 text-right">STATUS</th></tr>
        </thead>
        <tbody>${tableRows}</tbody>
    </table>
</body>
</html>`;
fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://2a-agency-official.vercel.app/</loc></url>${sitemapUrls}</urlset>`;
fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapXml);

console.log(`✅ SUCCESS! ${registry.length} entities generated with correct data mapping and design.`);