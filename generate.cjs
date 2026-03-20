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
const emeraldDark = "#065f46"; 

// 1. GÉNÉRATION DES RAPPORTS INDIVIDUELS
registry.forEach(brand => {
    const rawName = brand.entity?.name || brand.entity || "Unknown Entity";
    const iqScore = brand.cultural_intelligence?.brand_heat_index?.value || brand.AI_IQ || "N/A";
    const sorId = brand["2a_id"] || brand.SOR_ID || "NO-ID";
    const category = brand.entity?.category || "Luxury Portfolio";
    const moat = brand.cultural_intelligence?.cultural_moat?.value || "Audit in progress.";
    
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
</head>
<body class="bg-white text-black p-6 md:p-12 italic uppercase font-bold">
    <nav class="mb-12 border-b border-black/10 pb-4 flex justify-between">
        <a href="index.html" class="opacity-50 hover:opacity-100 text-[9px]">← SYSTEM OF RECORD</a>
        <span class="text-[9px] opacity-30 italic">PROTOCOL V1.2.9</span>
    </nav>
    <main class="max-w-5xl mx-auto">
        <p class="text-[#065f46] text-[12px] mb-2 tracking-[0.3em] font-black">${escapeHtml(category)}</p>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-[#065f46] uppercase">${escapeHtml(rawName)}</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-black/10 pt-8">
            <div>
                <p class="text-[10px] opacity-40 mb-2">AI IQ INDEX</p>
                <p class="text-8xl md:text-9xl text-[#065f46] font-black leading-none">${iqScore}</p>
            </div>
            <div class="space-y-6">
                <div><p class="text-[10px] opacity-40 mb-1 font-normal">CULTURAL MOAT</p><p class="normal-case font-medium text-sm leading-relaxed">${escapeHtml(moat)}</p></div>
                <div><p class="text-[10px] opacity-40 mb-1">SOR_ID</p><p class="text-xl">${sorId}</p></div>
            </div>
        </div>
    </main>
</body>
</html>`;

    fs.writeFileSync(filePath, htmlContent);
    
    tableRows += `
    <tr class="border-b border-black/5 hover:bg-emerald-50 transition-all cursor-pointer group" onclick="window.location.href='${fileName}'">
        <td class="p-6 text-sm uppercase font-bold text-[#065f46]">${escapeHtml(rawName)}</td>
        <td class="p-6 text-[#065f46] text-2xl font-black tracking-tighter">${iqScore}</td>
        <td class="p-6 opacity-40 text-[10px] font-mono tracking-tighter">${sorId}</td>
        <td class="p-6 text-right"><span class="border border-[#065f46]/30 text-[#065f46] text-[9px] px-3 py-1 group-hover:bg-[#065f46] group-hover:text-white transition-all italic tracking-widest">ACCESS_DATA</span></td>
    </tr>`;
    sitemapUrls += `<url><loc>https://2a-agency-official.vercel.app/${fileName}</loc></url>\n`;
});

// 2. GÉNÉRATION DE L'INDEX GLOBAL (Avec Restauration du Whitepaper)
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>2A AGENCY | SYSTEM OF RECORD</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-black p-6 md:p-20 italic uppercase font-bold">
    <header class="mb-16 border-b-4 border-[#065f46] pb-10 flex flex-col md:flex-row justify-between items-end">
        <div>
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter italic uppercase text-[#065f46]">2A AGENCY <br>SYSTEM OF RECORD</h1>
            <p class="opacity-40 text-[10px] tracking-[0.5em] mt-4">GLOBAL BRAND INTELLIGENCE REGISTRY • ${registry.length} ENTITIES</p>
        </div>
        
        <div class="flex gap-4 mt-8 md:mt-0">
            <a href="whitepaper.pdf" class="bg-[#065f46] text-white text-[10px] px-6 py-3 tracking-widest hover:bg-black transition-all">READ_WHITEPAPER</a>
            <a href="#" class="border border-[#065f46] text-[#065f46] text-[10px] px-6 py-3 tracking-widest hover:bg-emerald-50 transition-all">AGENCY_STRUCTURE</a>
        </div>
    </header>

    <main>
        <table class="w-full text-left">
            <thead class="opacity-30 text-[9px] tracking-widest border-b border-black/10 uppercase">
                <tr><th class="p-6">ENTITY NAME</th><th class="p-6">AI_IQ</th><th class="p-6">SOR_ID</th><th class="p-6 text-right">STATUS</th></tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    </main>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

// 3. SITEMAP
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://2a-agency-official.vercel.app/</loc></url>${sitemapUrls}</urlset>`;
fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapXml);

console.log(`✅ Restore Complete: Whitepaper links added, White background active.`);