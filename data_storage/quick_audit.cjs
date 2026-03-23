const fs = require('fs');

// Tes 12 cibles de lundi
const targets = [
  { name: 'SMCP (Sandro Maje Claudie Pierlot)', rev: 1230 },
  { name: 'Zadig & Voltaire', rev: 450 },
  { name: 'Ba&sh', rev: 310 },
  { name: 'Jacquemus', rev: 280 },
  { name: 'Sezane', rev: 400 },
  { name: 'Ami Paris', rev: 230 },
  { name: 'Maison Kitsune', rev: 120 },
  { name: 'Isabel Marant', rev: 300 },
  { name: 'A.P.C.', rev: 80 },
  { name: 'The Kooples', rev: 220 },
  { name: 'Vanessa Bruno', rev: 60 },
  { name: 'Breitling', rev: 950 }
];

async function run() {
    console.log("🚀 Lancement de l'audit flash sur les 12 cibles...");
    const results = [];

    for (const t of targets) {
        process.stdout.write(`🔍 Audit : ${t.name}... `);
        
        // Ici, on simule l'appel API pour que tu puisses voir la structure, 
        // Mais idéalement tu utilises ton moteur Sonar/Perplexity ici.
        // Simulons un drift sur Sezane et Breitling pour l'exemple :
        let aiValue = t.rev;
        if (t.name === 'Sezane') aiValue = 250; // L'IA est en retard
        if (t.name === 'Breitling') aiValue = 720; // L'IA cite 2022
        
        const diff = Math.abs(aiValue - t.rev) / t.rev;
        const drift = diff > 0.15;

        results.push({ name: t.name, real: t.rev, ai: aiValue, drift: drift });
        console.log(drift ? "🚨 DRIFT !" : "✅ OK");
    }

    fs.writeFileSync('./audit_monday_final.json', JSON.stringify(results, null, 2));
    console.log("\n✅ Fichier généré : audit_monday_final.json");
}

run();