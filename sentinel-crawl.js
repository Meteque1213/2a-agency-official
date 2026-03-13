import 'dotenv/config'; 
import FirecrawlApp from '@mendable/firecrawl-js';
import Groq from "groq-sdk"; // NOUVEAU
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // NOUVEAU

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/pdf,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://www.google.com/'
};

// --- NOUVEAU : FONCTION ANALYSE IA ---
async function analyzeChange(oldSnippet, newSnippet, brandName) {
    if (!oldSnippet || oldSnippet === "Direct access mode") return "Technical binary update detected.";
    console.log(`🧠 AI Brain: Analyzing narrative shift for ${brandName}...`);
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a senior financial auditor at 2A Agency. Compare two snippets of a corporate report. Identify the major change in ONE very short sentence (max 12 words) in English. Be precise about numbers or strategy. If no real change, say 'Minor report formatting'."
                },
                {
                    role: "user",
                    content: `Brand: ${brandName}\nOLD: ${oldSnippet}\nNEW: ${newSnippet}`
                }
            ],
            model: "llama3-8b-8192",
        });
        return completion.choices[0]?.message?.content || "Integrity verification successful.";
    } catch (e) {
        return "Manual audit required.";
    }
}

async function archivePdf(url, brandName) {
    try {
        const archiveDir = `./archive/${brandName.replace(/\s+/g, '_')}`;
        await fs.mkdir(archiveDir, { recursive: true });
        const fileName = `report_${new Date().toISOString().split('T')[0]}.pdf`;
        const filePath = path.join(archiveDir, fileName);
        const response = await fetch(url, { headers: HEADERS });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));
        return filePath;
    } catch (e) { return null; }
}

async function getPdfHash(url) {
    try {
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
            const oldBrand = data[category][index];
            
            if (oldBrand.doc_hash && oldBrand.doc_hash !== brandData.doc_hash) {
                console.log(`🚨 ALERT : Change detected for ${brandData.name}`);
                brandData.alert_status = "MODIFIED";
                // APPEL À L'IA ICI
                brandData.audit_comment = await analyzeChange(oldBrand.content_snippet, brandData.content_snippet, brandData.name);
            } else {
                brandData.alert_status = "STABLE";
                brandData.audit_comment = "Integrity verified.";
            }
            data[category][index] = { ...oldBrand, ...brandData };
        } else {
            brandData.alert_status = "NEW";
            brandData.audit_comment = "Monitoring started.";
            data[category].push(brandData);
        }
        await fs.writeFile(filePath, JSON.stringify(data, null, 4));
        console.log(`💾 Registry: ${brandData.name} [${brandData.alert_status}]`);
    } catch (e) { console.error("Update error:", e.message); }
}

async function auditSource(url, name) {
    try {
        const response = await app.scrape(url, { formats: ['markdown'] });
        if (response?.markdown) {
            const pdfRegex = /(https:\/\/.*?\.pdf)/;
            const match = response.markdown.match(pdfRegex);
            return { pdfUrl: match ? match[0] : null, snippet: response.markdown.substring(0, 1000) };
        }
    } catch (e) { return null; }
    return null;
}

async function runSentinel() {
    console.log("🛡️  SENTINEL AI-CORE : ACTIVATED");
    const rawData = await fs.readFile('./targets.json', 'utf-8');
    const TARGETS = JSON.parse(rawData);

    for (const target of TARGETS) {
        try {
            console.log(`📡 Scanning ${target.name}...`);
            let pdfUrl = target.searchUrl.endsWith('.pdf') ? target.searchUrl : null;
            let snippet = "Direct access mode";
            
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
                        doc_hash: hash,
                        hash: "0x" + hash.substring(0, 24) + "...",
                        proofUrl: pdfUrl,
                        local_archive: localPath,
                        last_audit: new Date().toISOString(),
                        content_snippet: snippet
                    };
                    await updateRegistry(brandData, target.category);
                }
            }
        } catch (error) { console.error(`💀 Error ${target.name}:`, error.message); }
    }
    console.log("\n🏁 AI AUDIT COMPLETE.");
}

runSentinel();