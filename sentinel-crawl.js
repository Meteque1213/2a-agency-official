import FirecrawlApp from '@mendable/firecrawl-js';
import crypto from 'crypto';
import fs from 'fs/promises';

const app = new FirecrawlApp({apiKey: "fc-9b19e9af7c464b58a30be98c4c9f1e43"}); 

async function getPdfHash(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const hash = crypto.createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex');
    return hash;
}

async function updateRegistry(brandData) {
    try {
        const filePath = './registry-data.json';
        const fileContent = await fs.readFile(filePath, 'utf-8');
        let data = JSON.parse(fileContent);

        // On cherche si la marque existe déjà pour la mettre à jour, sinon on l'ajoute
        const index = data.luxury.findIndex(b => b.name === brandData.name);
        if (index !== -1) {
            data.luxury[index] = { ...data.luxury[index], ...brandData };
        } else {
            data.luxury.push(brandData);
        }

        await fs.writeFile(filePath, JSON.stringify(data, null, 4));
        console.log(`💾 Registry Updated for ${brandData.name} !`);
    } catch (error) {
        console.error("❌ Database Error:", error.message);
    }
}

async function runSentinel() {
    console.log("🛡️  SENTINEL-01 : STARTING AUTO-INGESTION...");

    try {
        const response = await app.scrape('https://www.lvmh.fr/actionnaires/publications/', {
            formats: ['markdown']
        });

        if (response && response.markdown) {
            const pdfRegex = /\[Télécharger\]\((https:\/\/.*?\.pdf)\)/;
            const match = response.markdown.match(pdfRegex);

            if (match && match[1]) {
                const pdfUrl = match[1];
                const hash = await getPdfHash(pdfUrl);
                
                const lvmhData = {
                    name: "LVMH",
                    score: 96,
                    doc_label: "URD_2026_REMUNERATION_AUTO",
                    doc_hash: hash,
                    hash: "0x" + hash.substring(0, 64), // Simulation d'un hash on-chain
                    proofUrl: pdfUrl,
                    last_audit: new Date().toISOString()
                };

                await updateRegistry(lvmhData);
                console.log("✅ Process Complete. Site ready for refresh.");
            }
        }
    } catch (error) {
        console.error("❌ Sentinel System Error:", error.message);
    }
}

runSentinel();