const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Assure-toi que c'est le bon nom de ton fichier JSON (celui mis à jour avec 3795 entités)
const registryPath = path.join(__dirname, 'registry.json'); 

try {
    const data = fs.readFileSync(registryPath, 'utf8');
    const rootHash = '0x' + crypto.createHash('sha256').update(data).digest('hex');
    
    console.log("--------------------------------------------------");
    console.log("💎 NOUVEAU ROOT HASH GÉNÉRÉ (v1.1.0)");
    console.log(`📊 Entités auditées : ${JSON.parse(data).length}`);
    console.log(`🔐 Root Hash : ${rootHash}`);
    console.log("--------------------------------------------------");
    console.log("👉 Copie ce hash dans ton script de notarisation.");
} catch (e) {
    console.error("Erreur : Fichier de registre introuvable.");
}