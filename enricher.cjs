require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const REGISTRY_PATH = './registry.json';
const BACKUP_PATH = './registry.backup.json';
const PROGRESS_PATH = './enricher.progress.json';

// --- CONFIGURATION TRANCHE 1 ---
const START_INDEX = 0; 
const BATCH_SIZE = 500; 
const DELAY_MS = 3000; 
const MAX_RETRIES = 3;

async function queryPerplexity(prompt, retries = 0) {
    try {
        const response = await axios.post(
            'https://api.perplexity.ai/chat/completions',
            {
                model: 'sonar-pro',
                messages: [
                    { role: 'system', content: 'You are a financial data extraction bot. Output strictly JSON. No prose.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1
            },
            {
                headers: {
                    'Authorization': `Bearer ${PERPLEXITY_API_KEY.trim()}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response?.status === 429 && retries < MAX_RETRIES) {
            const wait = 5000 * Math.pow(2, retries);
            await new Promise(r => setTimeout(r, wait));
            return queryPerplexity(prompt, retries + 1);
        }
        throw error;
    }
}

async function enrichBrand(brand) {
    const name = brand?.entity?.name || "Unknown Entity";
    const targetFiscalYear = new Date().getFullYear() - 1;
    let raw = null;

    const prompt = `Analyze the company: "${name}". Target FY: ${targetFiscalYear}.
CRITICAL: "value" must be TOTAL ANNUAL REVENUE in the specified "unit".
Example: value 800 + unit "millions" = 800 million total revenue. 
Example: value 1.2 + unit "billions" = 1.2 billion total revenue.
If no reliable revenue found, set value to null, status to "unavailable".
Output strictly JSON: {
  "fiscal_year": "${targetFiscalYear}",
  "data_origin": "official_filing|cross_referenced_estimates|founder_interview_press|algorithmic_estimate",
  "financials": { "annual_revenue": { "value": <number|null>, "currency": "<ISO>", "unit": "millions|billions", "is_estimated": <bool>, "status": "reported|reported_estimate|founder_disclosed|algorithmic_estimate|unavailable" } },
  "proof": { "sources": [{ "name": "string", "url": "string|null", "reliability": "high|medium|low" }], "disclaimer": "string|null" }
}`;

    try {
        raw = await queryPerplexity(prompt);
        const clean = raw.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);

        const detectedTier = parsed.data_origin === 'official_filing' ? 1 : 
                             parsed.data_origin === 'cross_referenced_estimates' ? 2 : 3;

        const enriched = {
            ...brand,
            data_meta: {
                ...brand.data_meta,
                last_updated: new Date().toISOString().split('T')[0],
                tier: detectedTier,
                confidence_score: detectedTier === 1 ? 0.95 : detectedTier === 2 ? 0.75 : 0.50,
                data_origin: parsed.data_origin
            },
            financials: {
                ...brand.financials,
                annual_revenue: {
                    value: parsed.financials.annual_revenue.value,
                    currency: parsed.financials.annual_revenue.currency,
                    unit: parsed.financials.annual_revenue.unit,
                    is_estimated: parsed.financials.annual_revenue.is_estimated,
                    status: parsed.financials.annual_revenue.status
                }
            },
            proof: {
                sources: parsed.proof.sources,
                disclaimer: parsed.proof.disclaimer || null
            }
        };

        return { brand: enriched, changed: true };
    } catch (error) {
        console.error(`\n❌ Échec sur ${name} :`, error.message);
        return { brand, changed: false };
    }
}

async function main() {
    if (!PERPLEXITY_API_KEY) { process.exit(1); }

    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(registry, null, 2));

    // FIX : Calcul du point de fin ABSOLU de la tranche avant la reprise
    const end = Math.min(START_INDEX + BATCH_SIZE, registry.length);
    
    let startIndex = START_INDEX;
    if (fs.existsSync(PROGRESS_PATH)) {
        const prog = JSON.parse(fs.readFileSync(PROGRESS_PATH));
        if (prog.last_index >= START_INDEX && prog.last_index < end) {
            startIndex = prog.last_index + 1;
            console.log(`⏩ Reprise auto depuis index ${startIndex} (${prog.last_name})`);
        }
    }

    let stats = { enriched: 0, failed: 0, tier1: 0, tier2: 0, tier3: 0 };

    console.log(`🚀 Démarrage Tranche : ${startIndex} à ${end} (Cible finale index : ${end})\n`);

    for (let i = startIndex; i < end; i++) {
        const totalToProcess = end - startIndex;
        const currentProcessed = i - startIndex + 1;
        const percent = ((currentProcessed / (totalToProcess || 1)) * 100).toFixed(1);
        
        process.stdout.write(`\r [${percent}%] Audité : ${registry[i]?.entity?.name?.substring(0, 20)}... `);

        const { brand, changed } = await enrichBrand(registry[i]);
        
        if (changed) {
            registry[i] = brand;
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
            fs.writeFileSync(PROGRESS_PATH, JSON.stringify({ 
                last_index: i, 
                last_name: brand.entity?.name,
                timestamp: new Date().toISOString()
            }));
            stats.enriched++;
            stats[`tier${brand.data_meta.tier}`]++;
        } else {
            stats.failed++;
        }

        if (i < end - 1) await new Promise(r => setTimeout(r, DELAY_MS));
    }

    console.log(`\n\n✅ Tranche terminée.`);
    console.log(`📊 Stats : Tier 1: ${stats.tier1} | Tier 2: ${stats.tier2} | Tier 3: ${stats.tier3} | Échecs: ${stats.failed}`);
}

main();