import fs from 'fs';
import crypto from 'crypto';

// 1. LA LISTE DES CIBLES (Ajoute tes marques ici)
const brands = [
    { name: "LOUIS VUITTON", id: "LVMH-2026-001", score: 98, type: "Luxury" },
    { name: "OPENAI", id: "OAI-2026-009", score: 94, type: "Tech" },
    { name: "OLIPOP", id: "DNVB-2026-004", score: 85, type: "DNVB" },
    { name: "HERMES", id: "RMS-2026-002", score: 99, type: "Luxury" },
    { name: "TESLA", id: "TSLA-2026-012", score: 91, type: "Tech" }
];

const registry = [];

// Vérifier si le dossier audits existe, sinon le créer
if (!fs.existsSync('audits')){
    fs.mkdirSync('audits');
}

brands.forEach((brand, index) => {
    const fileName = `MEMO_${brand.name.replace(/\s+/g, '_')}_${brand.id}.txt`;
    
    // 2. GÉNÉRATION DU MÉMO AUTOMATIQUE
    const content = `--------------------------------------------------
2A AGENCY - FORENSIC UNIT REPORT
BRAND: ${brand.name}
CASE ID: ${brand.id}
PROTOCOL: ERC-8004
--------------------------------------------------
[AUTOMATED ANALYSIS]
Integrity Score: ${brand.score}/100
Category: ${brand.type} Forensic Audit

[FINDINGS]
Digital footprint analyzed. Heritage and data 
transparency verified on Base L2. 

[VERDICT]
Notarized for AI-Agent Trust.
--------------------------------------------------`;

    fs.writeFileSync(fileName, content);

    // 3. CALCUL DU HASH AUTOMATIQUE
    const hash = crypto.createHash('sha256').update(content).digest('hex');

    // 4. CONSTRUCTION DU REGISTRE
    registry.push({
        brand: brand.name,
        id: brand.id,
        score: `${brand.score}/100`,
        hash: `0x${hash}`,
        memo: fileName,
        featured: index === 0 // Le premier de la liste est "Featured"
    });

    console.log(`✅ Generated: ${brand.name} (Hash: ${hash.substring(0,10)}...)`);
});

// 5. SAUVEGARDE DU REGISTRY.JSON
fs.writeFileSync('audits/registry.json', JSON.stringify(registry, null, 2));
console.log('\n🚀 Registry updated with all brands!');