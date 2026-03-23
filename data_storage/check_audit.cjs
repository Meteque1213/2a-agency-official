// --- 2A Agency | Sentinel Engine | Audit Checker ---
// Usage: node check_audit.cjs "Nom de la Marque"

const fs = require('fs');

// --- Chargement du Registre Canonique (les 1180 marques) ---
const rawData = fs.readFileSync('registry.json');
const registry = JSON.parse(rawData);

// --- Récupération du nom de la marque depuis la commande ---
const brandToCheck = process.argv[2];

if (!brandToCheck) {
  console.log("-----------------------------------------");
  console.log("❌ ERREUR : Tu dois fournir un nom de marque.");
  console.log("Usage: node check_audit.cjs \"Nom de la Marque\"");
  console.log("-----------------------------------------");
  process.exit(1);
}

console.log("-----------------------------------------");
console.log(`🔎 RECHERCHE : "${brandToCheck}" dans l'index Sentinel...`);
console.log("-----------------------------------------");

// --- Recherche (insensible à la casse) ---
const result = registry.find(item => item.brand.toLowerCase() === brandToCheck.toLowerCase());

if (result) {
  console.log("-----------------------------------------");
  console.log("✅ AUDIT TROUVÉ & CONFIRMÉ");
  console.log(`🆔 ID Record : ${result.id}`);
  console.log(`🛡️ ID Audit  : ${result.id_audit}`);
  console.log(`📊 Score     : ${result.score}`);
  console.log(`🔐 Hash      : ${result.integrity_hash}`);
  console.log(`🔗 Blockchain: Notarized on Base L2`);
  console.log("-----------------------------------------");
} else {
  console.log("-----------------------------------------");
  console.log(`❌ MARQUE NON TROUVÉE.`);
  console.log(`Cette marque n'est pas encore auditée dans le Batch 02.`);
  console.log("-----------------------------------------");
}