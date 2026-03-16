require('dotenv').config();
const fs = require('fs');
const Firecrawl = require('@mendable/firecrawl-js');

const FirecrawlApp = Firecrawl.default || Firecrawl;
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

async function run() {
    console.log("🚀 SENTINEL-01 : Scan ciblé (2 pages)...");
    try {
        const res = await app.crawl('https://www.bcorporation.net/en-us/find-a-b-corp/', {
            limit: 2, 
            scrapeOptions: { formats: ['markdown'] }
        });

        if (res.success) {
            let content = "";
            for (let i = 0; i < res.data.length; i++) {
                content += "SOURCE: " + res.data[i].url + "\n" + res.data[i].markdown + "\n\n---\n\n";
            }
            fs.writeFileSync('RAW_BCORP_DATA.md', content);
            console.log("✅ SUCCÈS ! Fichier RAW_BCORP_DATA.md créé.");
        } else {
            console.log("❌ Erreur Firecrawl: " + res.error);
        }
    } catch (e) {
        console.log("❌ Erreur Système: " + e.message);
    }
}

run();