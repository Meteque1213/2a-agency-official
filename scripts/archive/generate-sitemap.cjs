const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.2aagency.com';
const auditsDir = path.join(__dirname, 'audits');
const outputFile = path.join(__dirname, 'sitemap.xml');
const today = new Date().toISOString().split('T')[0];

const staticPages = [
    { url: '', prio: '1.0' },
    { url: '/audits.html', prio: '0.9' },
    { url: '/manifesto.html', prio: '0.8' },
    { url: '/whitepaper.html', prio: '0.8' },
    { url: '/thanks.html', prio: '0.5' }
];

function generate() {
    console.log("🚀 Démarrage de la génération...");
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    staticPages.forEach(p => {
        xml += '  <url>\n    <loc>' + BASE_URL + p.url + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <priority>' + p.prio + '</priority>\n  </url>\n';
    });

    if (fs.existsSync(auditsDir)) {
        const files = fs.readdirSync(aDir);
        let count = 0;
        files.forEach(file => {
            if (file.endsWith('.html') && file !== 'index.html') {
                xml += '  <url>\n    <loc>' + BASE_URL + '/audits/' + file + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <priority>0.7</priority>\n  </url>\n';
                count++;
            }
        });
        console.log("✅ " + count + " audits trouvés.");
    }

    xml += '</urlset>';
    fs.writeFileSync(outputFile, xml);
    console.log("✅ sitemap.xml généré avec succès !");
}

generate();
