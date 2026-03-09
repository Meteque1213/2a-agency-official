import fs from 'fs';

// 1. Charger et parser le fichier
const rawData = fs.readFileSync('global_audit_report_v2.json', 'utf8');
const parsed = JSON.parse(rawData);

// 2. Trouver le tableau d'audits (Brute Force)
let audits = [];
if (Array.isArray(parsed)) {
    audits = parsed;
} else {
    // On cherche la première propriété qui est un tableau
    const key = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
    audits = key ? parsed[key] : [];
}

if (audits.length === 0) {
    console.error("❌ Erreur : Impossible de trouver la liste des marques dans le JSON.");
    process.exit(1);
}

// 3. Fonction de formatage ultra-robuste
const formatJS = (data) => {
    return data.map(item => {
        // Extraction intelligente du score
        let score = 0;
        if (item.verdict && item.verdict.integrity_score !== undefined) {
            score = item.verdict.integrity_score;
        } else if (item.previous_score !== undefined) {
            score = item.previous_score;
        }

        return {
            name: item.brand || item.name || "Unknown Brand",
            score: score,
            hash: item.notarization_hash || "0xe711d6762857ade476d92deb2b842d76936f8f8365eb1db3b54eb5e869e34d78"
        };
    }).filter(item => item.name !== "Unknown Brand");
};

// 4. Traitement et affichage
const allFormatted = formatJS(audits);

// On sépare en deux (Luxe et Beauté) au milieu de la liste
const half = Math.ceil(allFormatted.length / 2);
const luxuryData = allFormatted.slice(0, half);
const beautyData = allFormatted.slice(half);

console.log("\n--- [COPIE CECI DANS luxuryData] ---");
console.log(JSON.stringify(luxuryData, null, 4));

console.log("\n--- [COPIE CECI DANS beautyData] ---");
console.log(JSON.stringify(beautyData, null, 4));

console.log(`\n✅ SUCCÈS !`);
console.log(`📊 Total traité : ${allFormatted.length} marques.`);