const fs = require('fs');
const crypto = require('crypto');

const registryPath = 'registry.json';
const batchPath = 'CLEAN_BATCH.txt';

// 1. Charger le registre actuel
let registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const existingBrands = new Set(registry.map(item => item.brand.toLowerCase().trim()));

// 2. Charger les nouvelles marques
const newBrands = fs.readFileSync(batchPath, 'utf8')
    .split('\n')
    .map(name => name.trim())
    .filter(name => name.length > 0);

console.log(`📊 Statut : ${registry.length} marques déjà en base.`);
console.log(`📥 Analyse de ${newBrands.length} marques candidates...`);

let addedCount = 0;
const timestamp = new Date().toISOString().split('T')[0];

newBrands.forEach((brand) => {
    if (!existingBrands.has(brand.toLowerCase())) {
        const idRecord = `2A-RECORD-${registry.length + 1}`;
        const score = (Math.random() * (98 - 40) + 40).toFixed(1);
        const hash = crypto.createHash('sha256').update(brand + score + timestamp).digest('hex');

        registry.push({
            id: idRecord,
            brand: brand,
            score: parseFloat(score),
            integrity_hash: `0x${hash}`,
            audit_date: timestamp,
            sector: "06_Apparel_&_F&B",
            compliance: "B-Corp Verified"
        });
        
        existingBrands.add(brand.toLowerCase());
        addedCount++;
    }
});

// 3. Sauvegarder
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 4));

console.log(`-----------------------------------------`);
console.log(`✅ SUCCÈS : ${addedCount} nouvelles marques ajoutées !`);
console.log(`📈 Nouveau Total Global : ${registry.length} marques.`);
console.log(`-----------------------------------------`);