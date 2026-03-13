import fs from 'fs';

const registry = JSON.parse(fs.readFileSync('audits/registry.json', 'utf-8'));
const baseUrl = 'https://2aagency.com/';
const today = new Date().toISOString().split('T')[0]; // Date automatique

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}index.html</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}audits.html</loc><priority>0.9</priority></url>
  <url><loc>${baseUrl}whitepaper.html</loc><priority>0.8</priority></url>`;

registry.forEach(audit => {
    // encodeURIComponent sécurise les caractères spéciaux dans l'URL
    const safeMemo = encodeURIComponent(audit.memo);
    xml += `
  <url>
    <loc>${baseUrl}audits/${safeMemo}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.5</priority>
  </url>`;
});

xml += '\n</urlset>';

fs.writeFileSync('sitemap.xml', xml);

// On affiche le VRAI chiffre maintenant
console.log(`✅ Sitemap.xml generated with ${registry.length} links!`);