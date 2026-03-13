import 'dotenv/config'; 
import FirecrawlApp from '@mendable/firecrawl-js';
import crypto from 'crypto';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// --- CONFIGURATION DE DÉGUISEMENT (BYPASS) ---
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/pdf,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://www.google.com/'
};

const rawData = await fs.readFile('./targets.json', 'utf-8');
const TARGETS = JSON.parse(rawData);

async function archivePdf(url, brandName) {
    try {
        const archiveDir = `./archive/${brandName.replace(/\s+/g, '_')}`;
        await fs.mkdir(archiveDir, { recursive: true });
        const fileName = `report_${new Date().toISOString().split('T')[0]}.pdf`;
        const filePath = path.join(archiveDir, fileName);
        
        // On utilise les HEADERS ici pour tromper Ferrari
        const response = await fetch(url, { headers: HEADERS });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        
        const fileStream = createWriteStream(filePath);
        await pipeline(response.body, fileStream);
        return filePath;
    } catch (e) {
        console.error(`📁 Archive failed for ${brandName}: ${e.message}`);
        return null;
    }
}

async function getPdfHash(url) {
    try {
        // On utilise les HEADERS ici aussi
        const response = await fetch(url, { headers: HEADERS });
        const arrayBuffer = await response.arrayBuffer();
        return crypto.createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex');
    } catch (e) { return null; }
}

async function updateRegistry(brandData, category) {
    try {
        const filePath = './registry-data.json';
        const fileContent = await fs.readFile(filePath, 'utf-8');
        let data = JSON.parse(fileContent);
        if (!data[category]) data[category] = [];
        const index = data[category].findIndex(b => b.name === brandData.name);
        
        if (index !== -1) {
            const oldHash = data[category][index].doc_hash;
            brandData.alert_status = (oldHash && oldHash !== brandData.doc_hash) ? "MODIFIED" : "STABLE";
            if (brandData.alert_status === "MODIFIED") {
                console.log(`🚨 ALERT : Change detected for ${brandData.name}`);
                brandData.previous_hash = oldHash;
            }
            data[category][index] = { ...data[category][index], ...brandData };
        } else {
            brandData.alert_status = "NEW";
            data[category].push(brandData);
        }
        await fs.writeFile(filePath, JSON.stringify(data, null, 4));
        console.log(`💾 Registry: ${brandData.name} [${brandData.alert_status}]`);
    } catch (e) { console.error("Error updating registry:", e.message); }
}

async function auditSource(url, name) {
    console.log(`📡 Scanning ${name}...`);
    try {
        const response = await app.scrape(url, { formats: ['markdown'] });
        if (response?.markdown) {
            const pdfRegex = /(https:\/\/.*?\.pdf)/;
            const match = response.markdown.match(pdfRegex);
            return { pdfUrl: match ? match[0] : null, snippet: response.markdown.substring(0, 500) };
        }
    } catch (e) { return null; }
    return null;
}

async function runSentinel() {
    console.log("🛡️  SENTINEL BYPASS MODE : ACTIVATED");
    for (const target of TARGETS) {
        try {
            let pdfUrl = target.searchUrl.endsWith('.pdf') ? target.searchUrl : null;
            let snippet = "Direct PDF Access";
            if (!pdfUrl) {
                const result = await auditSource(target.searchUrl, target.name);
                if (result) { pdfUrl = result.pdfUrl; snippet = result.snippet; }
            }
            if (pdfUrl) {
                const hash = await getPdfHash(pdfUrl);
                if (hash) {
                    const localPath = await archivePdf(pdfUrl, target.name);
                    const brandData = {
                        name: target.name,
                        score: 95,
                        doc_hash: hash,
                        hash: "0x" + hash.substring(0, 24) + "...",
                        proofUrl: pdfUrl,
                        local_archive: localPath,
                        status: "SECURED",
                        last_audit: new Date().toISOString(),
                        content_snippet: snippet
                    };
                    await updateRegistry(brandData, target.category);
                    console.log(`✅ ${target.name} SECURED`);
                }
            }
        } catch (error) { console.error(`💀 Error ${target.name}:`, error.message); }
    }
    console.log("\n🏁 BYPASS MISSION COMPLETE.");
}

runSentinel();