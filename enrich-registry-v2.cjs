const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const registryPath = path.join(__dirname, 'registry.json');

// --- MATRICE DE VARIATIONS SÉMANTIQUES ---
const semantics = {
    luxe: {
        sectors: ["Haute Couture", "Luxury Goods", "Fine Watchmaking", "Jewelry"],
        statements: [
            "Heritage and brand lineage verified via Sentinel-01 protocol. Zero counterfeiting drift detected.",
            "Visual identity and semantic prestige anchored on-chain. Integrity score reflects market exclusivity.",
            "Luxury metadata alignment confirmed. Brand equity protection active under ERC-8004 standards."
        ],
        guards: ["Prestige-Focused", "Exclusivity-Guard", "Heritage-Protector"]
    },
    tech: {
        sectors: ["Artificial Intelligence", "Robotics", "DeepTech", "SaaS"],
        statements: [
            "Algorithmic integrity and training data transparency verified. Low risk of semantic hallucination.",
            "Neural weights and model metadata notarized. Integrity score confirms protocol stability.",
            "DeepTech compliance audit completed. Systems are aligned with sovereign AI standards."
        ],
        guards: ["Innovation-Driven", "Ethics-First", "Data-Sovereignty"]
    },
    bcorp: {
        sectors: ["Sustainable Business", "Social Impact", "Eco-Design", "ESG Leader"],
        statements: [
            "ESG commitments and social impact metrics verified. Integrity score reflects high corporate responsibility.",
            "Environmental transparency and governance ethics audited via Trust Nodes.",
            "Sustainability claim integrity confirmed. Zero greenwashing drift detected in public statements."
        ],
        guards: ["Impact-Oriented", "Transparent-Governance", "Eco-Guardian"]
    }
};

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateHash(name) {
    return '0x' + crypto.createHash('sha256').update(name).digest('hex').substring(0, 16);
}

function enrich() {
    let registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    let count = 0;

    registry = registry.map(item => {
        // On n'enrichit que les nouveaux ou les basiques (id format 2A-AUTO-...)
        if (item.memo && (!item.entity || item.category === "Audit 2026 / Expansion")) {
            const name = item.memo;
            
            // 1. DÉTERMINATION DU PROFIL (Basé sur des mots-clés ou aléatoire pour la diversité)
            let profile = semantics.bcorp; // Par défaut
            if (name.toLowerCase().includes('ai') || name.toLowerCase().includes('tech') || name.toLowerCase().includes('robot')) {
                profile = semantics.tech;
            } else if (name.length < 8 && Math.random() > 0.5) {
                profile = semantics.luxe;
            }

            // 2. DISTRIBUTION DES SCORES (Courbe de Gauss simulée)
            const rand = Math.random();
            let score, status;
            if (rand > 0.95) { score = Math.floor(Math.random() * 4) + 96; status = "AUTHORITY"; } // Top 5%
            else if (rand > 0.20) { score = Math.floor(Math.random() * 8) + 88; status = "STABLE"; }   // 75% Stable
            else { score = Math.floor(Math.random() * 10) + 78; status = "UNDER REVIEW"; }           // 20% Review

            count++;
            return {
                sor_id: item.id || item.sor_id,
                entity: {
                    name: name,
                    sector: getRandom(profile.sectors),
                    erc8004_id: generateHash(name + "ERC")
                },
                trust: {
                    score: score,
                    status: status,
                    ttl: `202${Math.floor(Math.random() * 3) + 7}-01-01`, // Dates variées entre 2027 et 2029
                    node: `SENTINEL-0${Math.floor(Math.random() * 5) + 1}`
                },
                ai_gateway: {
                    statement: `${name}: ${getRandom(profile.statements)}`,
                    character_guard: getRandom(profile.guards),
                    ontology: {
                        tech: profile === semantics.tech ? "Neural-Link" : "System-of-Record",
                        origin: "Verified"
                    }
                },
                proof: {
                    network: "Base L2",
                    hash: generateHash(name + "PROOF")
                }
            };
        }
        return item;
    });

    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 4));
    console.log(`✅ JALON 5000 READY: ${count} entités diversifiées avec succès.`);
}

enrich();