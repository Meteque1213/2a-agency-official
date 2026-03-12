import FirecrawlApp from '@mendable/firecrawl-js';
import crypto from 'crypto';
import fetch from 'node-fetch';

const app = new FirecrawlApp({apiKey: "fc-9b19e9af7c464b58a30be98c4c9f1e43"}); 

async function getPdfHash(url) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const hash = crypto.createHash('sha256').update(Buffer.from(buffer)).digest('hex');
    return hash;
}

async function runSentinel() {
    console.log("🛡️  SENTINEL-01 : STARTING AUTOMATED AUDIT...");

    const response = await app.scrape('https://www.lvmh.fr/actionnaires/publications/', {
        formats: ['markdown']
    });

    if (response.success) {
        // Extraction magique du lien PDF via Regex
        const pdfRegex = /\[Télécharger\]\((https:\/\/.*?\.pdf)\)/;
        const match = response.markdown.match(pdfRegex);

        if (match && match[1]) {
            const pdfUrl = match[1];
            console.log(`📍 Latest Document Detected: ${pdfUrl}`);
            
            console.log("⚡ Calculating Cryptographic Fingerprint (SHA-256)...");
            const hash = await getPdfHash(pdfUrl);
            
            console.log("\n--- REGISTRY READY DATA ---");
            console.log(`Brand: LVMH`);
            console.log(`Doc Label: URD_2025_LIVE`);
            console.log(`Doc Hash: ${hash}`);
            console.log(`Proof URL: ${pdfUrl}`);
            console.log("---------------------------\n");
            console.log("✅ Audit process complete. Ready for Git Push.");
        }
    }
}

runSentinel();