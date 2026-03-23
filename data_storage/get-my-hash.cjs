const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 1. On cible ton registre (vérifie bien le nom du fichier !)
const registryPath = path.join(__dirname, 'registry.json'); 

try {
    const data = fs.readFileSync(registryPath, 'utf8');
    const finalHash = '0x' + crypto.createHash('sha256').update(data).digest('hex');
    
    console.log("\n--------------------------------------------------");
    console.log("🚀 TON ROOT HASH POUR LE JALON 3700+");
    console.log("--------------------------------------------------");
    console.log(`📦 Fichier source : ${registryPath}`);
    console.log(`📊 Taille : ${data.length} caractères`);
    console.log(`🔐 HASH À COPIER : \x1b[32m${finalHash}\x1b[0m`);
    console.log("--------------------------------------------------\n");
    
} catch (err) {
    console.error("❌ Erreur : Impossible de lire le fichier. Vérifie qu'il s'appelle bien registry.json");
}