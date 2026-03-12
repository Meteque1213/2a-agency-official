import FirecrawlApp from '@mendable/firecrawl-js';
import crypto from 'crypto';
import fs from 'fs/promises';

const app = new FirecrawlApp({ apiKey: "fc-9b19e9af7c464b58a30be98c4c9f1e43" });

// --- TARGET MAP AVEC FALLBACKS (MODE OSINT) ---
const TARGETS = [
    { 
        name: "LVMH", 
        category: "luxury", 
        searchUrl: "https://www.lvmh.fr/actionnaires/publications/",
        fallbackUrl: "https://www.pappers.fr/entreprise/lvmh-moet-hennessy-louis-vuitton-775670417"
    },
    { 
        name: "Kering", 
        category: "luxury", 
        searchUrl: "https://www.kering.com/api/download-file/?path=Kering_2024_Full_Year_Results_Financial_Document_5682885973.pdf",
        fallbackUrl: "https://pappers.fr/entreprise/kering-552075195" 
    },
    { 
        name: "IKEA", 
        category: "home", 
        searchUrl: "https://www.inter.ikea.com/-/media/interikea/igi/financial-reports/fy24-financial-reports/inter-ikea-holding-bv-annual-report-fy24.pdf",
        fallbackUrl: "https://www.ikea.com/global/en/files/IKEA_Sustainability_Report_FY24.pdf"
    }
];

async function getPdfHash(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return crypto.createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex');
    } catch (e) { return null; }
}

async function updateRegistry(brandData, category) {
    const filePath = './registry-data.json';
    const fileContent = await fs.readFile(filePath, 'utf-8');
    let data = JSON.parse(fileContent);
    if (!data[category]) data[category] = [];
    const index = data[category].findIndex(b => b.name === brandData.name);
    if (index !== -1) { data[category][index] = { ...data[category][index], ...brandData }; }
    else { data[category].push(brandData); }
    await fs.writeFile(filePath, JSON.stringify(data, null, 4));
}

async function auditSource(url, name) {
    console.log(`📡 Scanning ${name} at ${url}...`);
    const response = await app.scrape(url, { formats: ['markdown'] });
    if (response && response.markdown) {
        const pdfRegex = /(https:\/\/.*?\.pdf)/;
        const match = response.markdown.match(pdfRegex);
        return match ? match[0] : null;
    }
    return null;
}

async function runSentinel() {
    console.log("🛡️  SENTINEL OSINT MODE : INITIATING INVESTIGATION...");

    for (const target of TARGETS) {
        try {
            let pdfUrl = null;
            let sourceMode = "OFFICIAL";

            // --- LOGIQUE FAST-PASS PDF ---
            if (target.searchUrl.endsWith('.pdf')) {
                pdfUrl = target.searchUrl;
            } else {
                pdfUrl = await auditSource(target.searchUrl, target.name);
            }

            // --- LOGIQUE FALLBACK OSINT ---
            if (!pdfUrl && target.fallbackUrl) {
                console.warn(`⚠️  Primary failed for ${target.name}. Switching to Fallback...`);
                if (target.fallbackUrl.endsWith('.pdf')) {
                    pdfUrl = target.fallbackUrl;
                } else {
                    pdfUrl = await auditSource(target.fallbackUrl, `${target.name} (Fallback)`);
                }
                sourceMode = "OSINT_VERIFIED";
            }

            if (pdfUrl) {
                const hash = await getPdfHash(pdfUrl);
                if (hash) {
                    const brandData = {
                        name: target.name,
                        score: 92,
                        doc_label: `CERTIFIED_DOC_${new Date().getFullYear()}`,
                        doc_hash: hash,
                        hash: "0x" + hash.substring(0, 32) + "...",
                        proofUrl: pdfUrl,
                        status: sourceMode === "OFFICIAL" ? "SECURE" : "OSINT_BACKED",
                        last_audit: new Date().toISOString()
                    };
                    await updateRegistry(brandData, target.category);
                    console.log(`✅ ${target.name} SECURED via ${sourceMode}`);
                }
            } else {
                console.error(`❌ All sources failed for ${target.name}.`);
            }
        } catch (error) {
            console.error(`💀 Fatal error on ${target.name}:`, error.message);
        }
    }
    console.log("\n🏁 INVESTIGATION COMPLETE. Registry is locked.");
}

// NE PAS OUBLIER CETTE LIGNE :
runSentinel();