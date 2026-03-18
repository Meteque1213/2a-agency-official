const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'registry.json');
let registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const seen = new Set();
const uniqueRegistry = [];

console.log(`🧹 Analyse de ${registry.length} entrées...`);

registry.forEach(entry => {
    const name = entry.entity.name.toLowerCase().trim();
    if (!seen.has(name)) {
        seen.add(name);
        uniqueRegistry.push(entry);
    }
});

// Ré-indexation des IDs de 1 à X
uniqueRegistry.forEach((entry, index) => {
    entry.sor_id = `2A-AUTO-${String(index + 1).padStart(4, '0')}`;
});

fs.writeFileSync(registryPath, JSON.stringify(uniqueRegistry, null, 2));

console.log(`✅ Nettoyage terminé !`);
console.log(`🚫 Doublons supprimés : ${registry.length - uniqueRegistry.size}`);
console.log(`📈 Nouveau total : ${uniqueRegistry.length}`);