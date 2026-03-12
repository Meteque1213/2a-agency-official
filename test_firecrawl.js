const FirecrawlApp = require('@mendable/firecrawl-js');

const app = new FirecrawlApp({apiKey: "TA_CLE_API_ICI"});

async function runSentinelCrawl() {
    console.log("🚀 SENTINEL-01 : Scanning LVMH for new reports...");

    // On utilise "scrape" pour extraire uniquement les liens de rapports
    const scrapeResult = await app.scrapeUrl('https://www.lvmh.fr/actionnaires/publications/', {
        formats: ['markdown'],
        onlyMainContent: true
    });

    if (scrapeResult.success) {
        console.log("✅ Data Extracted! Analysis in progress...");
        console.log(scrapeResult.markdown.substring(0, 500)); // On regarde les 500 premiers caractères
        
        // C'est ici qu'on enverra le texte à l'IA demain pour calculer le score
    } else {
        console.error("❌ Crawl failed:", scrapeResult.error);
    }
}

runSentinelCrawl();