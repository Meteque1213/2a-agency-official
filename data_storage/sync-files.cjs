const fs = require('fs');
const path = require('path');

const registry = JSON.parse(fs.readFileSync('./registry.json', 'utf8'));
const auditsDir = './audits';

// 1. Lister les noms de fichiers autorisés (basés sur le registre propre)
const allowedFiles = new Set(registry.map(e => 
    e.entity.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.html'
));

// 2. Scanner le dossier et supprimer les intrus
const files = fs.readdirSync(auditsDir);
let deletedCount = 0;

files.forEach(file => {
    if (file.endsWith('.html') && !allowedFiles.has(file)) {
        fs.unlinkSync(path.join(auditsDir, file));
        deletedCount++;
    }
});

console.log(`✅ Synchronisation terminée.`);
console.log(`🗑️  Fichiers HTML supprimés : ${deletedCount}`);
console.log(`📂 Fichiers restants dans /audits : ${allowedFiles.size}`);