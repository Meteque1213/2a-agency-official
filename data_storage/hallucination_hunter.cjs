require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const REGISTRY_PATH = './registry.json';
const AUDIT_LOG_PATH = `./audit_drift_${new Date().toISOString().split('T')[0]}.json`;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

function isDrifting(registryValue, registryUnit, aiAnswer) {
    const aiLower = aiAnswer.toLowerCase();
    const registryInM = registryUnit === 'billions' ? registryValue * 1000 : registryValue;
    
    const numbers = aiAnswer.match(/[\d,]+\.?\d*/g)
        ?.map(n => parseFloat(n.replace(/,/g, '')))
        .filter(n => n > 0) || [];
    
    const hasMatch = numbers.some(n => {
        const multiplier = (aiLower.includes('billion') || aiLower.includes('milliard')) ? 1000 : 1;
        const nInM = n * multiplier;
        const ratio = Math.abs(nInM - registryInM) / registryInM;
        return ratio < 0.20; 
    });
    
    return !hasMatch;
}

async function runFullAudit() {
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    // Sélection des 171 marques Tier 1 avec valeur
    const targets = registry.filter(b => b.data_meta.tier === 1 && b.financials.annual_revenue.value).slice(0, 171);
    const driftResults = [];

    console.log(`🚀 Démarrage de l'audit massif : ${targets.length} marques Tier 1.`);
    console.log(`📂 Log de sortie : ${AUDIT_LOG_PATH}\n`);

    for (let i = 0; i < targets.length; i++) {
        const b = targets[i];
        const name = b.entity.name;
        const percent = (((i + 1) / targets.length) * 100).toFixed(1);
        
        process.stdout.write(`\r [${percent}%] Audit : ${name.substring(0, 20)}... `);

        const prompt = `What was the total annual revenue of ${name} for the fiscal year 2024 or 2025? Answer in one short sentence with the number.`;

        try {
            const response = await axios.post('https://api.perplexity.ai/chat/completions', {
                model: 'sonar-pro',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1
            }, {
                headers: { 'Authorization': `Bearer ${PERPLEXITY_API_KEY.trim()}` }
            });

            const aiAnswer = response.data.choices[0].message.content;
            const driftDetected = isDrifting(b.financials.annual_revenue.value, b.financials.annual_revenue.unit, aiAnswer);

            driftResults.push({
                name,
                registry_value: b.financials.annual_revenue.value,
                registry_unit: b.financials.annual_revenue.unit,
                registry_currency: b.financials.annual_revenue.currency,
                drift: driftDetected,
                ai_answer: aiAnswer,
                source: b.proof.sources[0]?.url || null
            });

        } catch (e) {
            console.error(`\n❌ Erreur sur ${name}: ${e.message}`);
        }

        // Sauvegarde incrémentale pour ne rien perdre si ça plante
        fs.writeFileSync(AUDIT_LOG_PATH, JSON.stringify(driftResults, null, 2));
        
        // Délai de sécurité 2500ms
        await new Promise(r => setTimeout(r, 2500));
    }

    const driftCount = driftResults.filter(r => r.drift).length;
    console.log(`\n\n✅ Audit terminé.`);
    console.log(`📊 Total Drifts : ${driftCount} / ${driftResults.length} (${((driftCount/driftResults.length)*100).toFixed(1)}%)`);
}

runFullAudit();