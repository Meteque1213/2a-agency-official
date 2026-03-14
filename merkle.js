const crypto = require('crypto');
const fs = require('fs');

// Charge ton registre
const data = JSON.parse(fs.readFileSync('registry.json', 'utf8'));

// Crée les hashes pour chaque audit
const leaves = data.audits.map(audit => {
    const str = JSON.stringify(audit);
    return crypto.createHash('sha256').update(str).digest('hex');
});

// Calcule la racine (Merkle Root simplifiée pour ton volume)
const combinedHash = crypto.createHash('sha256').update(leaves.join('')).digest('hex');

console.log("TON MERKLE ROOT RÉEL EST :");
console.log("0x" + combinedHash);