import fs from 'fs';

// 1. CONFIGURATION
const DRIFT_THRESHOLD = 10;

// 2. SIMULATION DES SIGNAUX MARCHÉ
const marketSignals = [
    { 
        brand: "Rhode", 
        latest_event: "Hallucination massive sur l'origine des ingrédients détectée sur Perplexity.",
        observed_score: 38 
    },
    { 
        brand: "Hermès", 
        latest_event: "Stabilité parfaite des métadonnées sur les plateformes de revente.",
        observed_score: 98 
    }
];

// 3. CHARGEMENT ET PARSING SÉCURISÉ
const rawData = fs.readFileSync('global_audit_report_v2.json', 'utf8');
const parsed = JSON.parse(rawData);

// On cherche le tableau d'audits où qu'il soit
let audits = [];
if (Array.isArray(parsed)) {
    audits = parsed;
} else {
    const key = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
    audits = key ? parsed[key] : [];
}

// 4. MOTEUR DE DÉTECTION
function runDriftAnalysis() {
    console.log("\n🛡️  SENTINEL-01 : STARTING LIVE DRIFT MONITORING...");
    console.log("===============================================");

    if (audits.length === 0) {
        console.error("❌ ERREUR : Aucun audit trouvé dans le fichier JSON.");
        return;
    }

    marketSignals.forEach(signal => {
        // Recherche de la marque (flexible sur le nom de la clé)
        const currentAudit = audits.find(a => (a.brand || a.name) === signal.brand);
        
        if (currentAudit) {
            // Extraction du score actuel
            const currentScore = currentAudit.verdict?.integrity_score || currentAudit.score || currentAudit.previous_score;
            const driftGap = Math.abs(currentScore - signal.observed_score);

            console.log(`🔍 ANALYSING: ${signal.brand}`);
            console.log(`   > Registry Score : ${currentScore}`);
            console.log(`   > Market Signal  : ${signal.observed_score}`);
            console.log(`   > Drift Gap      : ${driftGap} pts`);

            if (driftGap > DRIFT_THRESHOLD) {
                console.log(`🚨 ALERT: CRITICAL DRIFT DETECTED!`);
                console.log(`   > Reason: ${signal.latest_event}`);
                console.log(`   > Status: Triggering Forensic Investigation Protocol.`);
            } else {
                console.log(`✅ STATUS: Nominal. No significant drift detected.`);
            }
            console.log("-----------------------------------------------");
        } else {
            console.log(`⚠️  SKIPPING: ${signal.brand} not found in the current registry.`);
        }
    });
}

runDriftAnalysis();