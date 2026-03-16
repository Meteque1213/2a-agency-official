const fs = require('fs');

try {
    const data = fs.readFileSync('registry.json', 'utf8');
    let currentRegistry = JSON.parse(data);

    if (!Array.isArray(currentRegistry)) {
        currentRegistry = [currentRegistry];
    }

    const newAudits = [
        { "id": "2A-RECORD-2001", "brand": "Patagonia", "score": 75.7, "integrity_hash": "0x9f1c4e7a8b2d6c5f1a3e4d9b7c8f2a6d5e1b3c7a9f4d6e2c8b1a5d7f3c9e6a2b", "status": "VERIFIED" },
        { "id": "2A-RECORD-2002", "brand": "Veja", "score": 60.3, "integrity_hash": "0x7c2a5e9d1f3b6a8c4d2e7f1a9b5c3d8e6f2a4b7c1d9e3f6a8b2c5d7e1f4a9b6c", "status": "VERIFIED" },
        { "id": "2A-RECORD-2003", "brand": "Chloé", "score": 42.6, "integrity_hash": "0x5e8a1c7d3f9b2a6e4d1c8b7f3a5e9d2c6b4a1f7e3d8c2b9a6f5e1d7c3a8b4f2d", "status": "VERIFIED" },
        { "id": "2A-RECORD-2004", "brand": "Danone France", "score": 47.1, "integrity_hash": "0x3b7e1a9c5d2f8a6e4c1b9d7f3a6e2c8b5d1f4a7e9c3b6d2a8f5e1c7a4b9d3f6e", "status": "VERIFIED" }
    ];

    const registryMap = new Map();

    // On ajoute l'existant
    currentRegistry.forEach(item => {
        if (item && item.brand) registryMap.set(item.brand.toLowerCase().trim(), item);
    });

    // On ajoute les nouveaux (écrase les doublons)
    newAudits.forEach(item => {
        registryMap.set(item.brand.toLowerCase().trim(), item);
    });

    const cleanRegistry = Array.from(registryMap.values());

    fs.writeFileSync('registry.json', JSON.stringify(cleanRegistry, null, 2));
    console.log("✅ Registre mis à jour sans doublons ! Total : " + cleanRegistry.length);

} catch (e) {
    console.error("❌ Erreur : " + e.message);
}