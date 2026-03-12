import FirecrawlApp from '@mendable/firecrawl-js';
import crypto from 'crypto';
import fs from 'fs/promises';

const app = new FirecrawlApp({ apiKey: "fc-9b19e9af7c464b58a30be98c4c9f1e43" });

// --- LA LISTE CIBLE (TARGET MAP) ---
const TARGETS = [
    { name: "LVMH", category: "luxury", searchUrl: "https://www.lvmh.fr/actionnaires/publications/" },
    { name: "Kering", category: "luxury", searchUrl: "https://www.kering.com/fr/finance/publications/" },
    { name: "Hermès", category: "luxury", searchUrl: "https://finance.hermes.com/fr/publications/" },
    { name: "L'Oréal", category: "beauty", searchUrl: "https://www.loreal-finance.com/fr/rapport-annuel/" },
    { name: "Estée Lauder", category: "beauty", searchUrl: "https://www.elcompanies.com/en/investors/results-and-events" },
    { name: "Tesla", category: "mobility", searchUrl: "https://ir.tesla.com/" },
    { name: "Ferrari", category: "mobility", searchUrl: "https://www.ferrari.com/en-EN/corporate/investors" },
    { name: "Mercedes-Benz", category: "mobility", searchUrl: "https://group.mercedes-benz.com/investors/reports/" },
    { name: "NVIDIA", category: "crypto", searchUrl: "https://investor.nvidia.com/" },
    { name: "Coinbase", category: "crypto", searchUrl: "https://investor.coinbase.com/" },
    { name: "Apple", category: "crypto", searchUrl: "https://investor.apple.com/" },
    { name: "Pernod Ricard", category: "fnb", searchUrl: "https://www.pernod-ricard.com/fr/investisseurs/resultats-et-publications" },
    { name: "Danone", category: "fnb", searchUrl: "https://www.danone.com/fr/investor-relations/publications-events.html" },
    { name: "Inditex (Zara)", category: "apparel", searchUrl: "https://www.inditex.com/itxcomweb/en/investors/relations/annual-reports" },
    { name: "Nike", category: "apparel", searchUrl: "https://investors.nike.com/investors/news-events-and-reports/" },
    { name: "Unibail-Rodamco", category: "realestate", searchUrl: "https://www.urw.com/en/investors/financial-reports" },
    { name: "IKEA", category: "home", searchUrl: "https://about.ikea.com/en/about-us/financial-information" },
    { name: "Novo Nordisk", category: "longevity", searchUrl: "https://www.novonordisk.com/investors/reports-and-presentations.html" }
];

async function getPdfHash(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return crypto.createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex');
    } catch (e) {
        return null;
    }
}

async function updateRegistry(brandData, category) {
    try {
        const filePath = './registry-data.json';
        const fileContent = await fs.readFile(filePath, 'utf-8');
        let data = JSON.parse(fileContent);

        // Si la catégorie n'existe pas encore dans le JSON, on la crée
        if (!data[category]) data[category] = [];

        const index = data[category].findIndex(b => b.name === brandData.name);
        if (index !== -1) {
            data[category][index] = { ...data[category][index], ...brandData };
        } else {
            data[category].push(brandData);
        }

        await fs.writeFile(filePath, JSON.stringify(data, null, 4));
        console.log(`💾 Registry Updated: ${brandData.name} [${category}]`);
    } catch (error) {
        console.error("❌ Database Error:", error.message);
    }
}

async function runSentinel() {
    console.log("🛡️  SENTINEL-01 : STARTING MASSIVE DATA INGESTION...");
    const startTime = Date.now();

    for (const target of TARGETS) {
        console.log(`🔍 Auditing ${target.name}...`);
        try {
            // On utilise scrape pour trouver les liens PDF dans la page
            const response = await app.scrape(target.searchUrl, {
                formats: ['markdown']
            });

            if (response && response.markdown) {
                // Regex améliorée pour attraper le premier lien PDF disponible
                const pdfRegex = /(https:\/\/.*?\.pdf)/;
                const match = response.markdown.match(pdfRegex);

                if (match && match[0]) {
                    const pdfUrl = match[0];
                    const hash = await getPdfHash(pdfUrl);

                    if (hash) {
                        const brandData = {
                            name: target.name,
                            score: Math.floor(Math.random() * (98 - 85 + 1)) + 85, // Score simulé pour le test
                            doc_label: `ANNUAL_REPORT_${new Date().getFullYear()}`,
                            doc_hash: hash,
                            hash: "0x" + hash.substring(0, 32) + "...", // Signature visuelle
                            proofUrl: pdfUrl,
                            last_audit: new Date().toISOString()
                        };

                        await updateRegistry(brandData, target.category);
                        console.log(`✅ ${target.name} : SUCCESS`);
                    }
                } else {
                    console.warn(`⚠️  No PDF found for ${target.name}`);
                }
            }
        } catch (error) {
            console.error(`❌ Error scanning ${target.name}:`, error.message);
        }
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n🏁 MASS SCAN COMPLETE in ${duration}s. System of Record is Live.`);
}

runSentinel();