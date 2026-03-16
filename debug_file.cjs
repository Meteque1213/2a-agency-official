const fs = require('fs');
const data = fs.readFileSync('FREE_EXTRACTED_NAMES.txt', 'utf8');
const lines = data.split(/\r?\n/).filter(l => l.trim().length > 0);

console.log("📏 Nombre de lignes lues par Node :", lines.length);
console.log("🔍 5 premières lignes :", lines.slice(0, 5));
console.log("🔍 5 dernières lignes :", lines.slice(-5));