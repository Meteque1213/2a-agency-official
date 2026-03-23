const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const registryPath = path.join(__dirname, 'registry.json'); // Vérifie bien que c'est le bon nom !
const listPath = path.join(__dirname, 'FINAL_LIST.txt');
const auditsDir = path.join(__dirname, 'audits');

if (!fs.existsSync(auditsDir)) fs.mkdirSync(auditsDir);

async function forge() {
    console.log("🛡️  Vérification du registre actuel...");
    
    // 1. Charger le registre existant
    let registry = [];
    if (fs.existsSync(registryPath)) {
        registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    }

    // 2. Créer un Set des noms déjà présents (pour recherche ultra-rapide)
    const existingNames = new Set(registry.map(e => e.entity.name.toLowerCase().trim()));
    const seenInThisRun = new Set(); // Sécurité pour les doublons dans FINAL_LIST.txt

    console.log(`🔍 ${existingNames.size} entités déjà protégées dans le registre.`);

    // 3. Lire la nouvelle liste
    const rawList = fs.readFileSync(listPath, 'utf8');
    const names = rawList.split('\n')
        .map(n => n.trim())
        .filter(n => n.length > 0);

    let newCount = 0;
    let duplicateCount = 0;

    // 4. Boucle de création
    names.forEach((name) => {
        const cleanName = name.toLowerCase().trim();

        // --- LE FILTRE DE SÉCURITÉ ---
        if (existingNames.has(cleanName) || seenInThisRun.has(cleanName)) {
            duplicateCount++;
            return; // On ignore ce nom, il existe déjà
        }

        // --- CRÉATION DE L'ENTITÉ ---
        const safeId = registry.length + 1;
        const fileName = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.html';
        
        const newEntity = {
            sor_id: `2A-AUTO-${String(safeId).padStart(4, '0')}`,
            entity: {
                name: name,
                category: "PENDING_CLASSIFICATION", // Sera enrichi par enrich-registry-v2.cjs
                status: "VERIFIED"
            },
            proof: {
                hash: "0x" + Math.random().toString(16).slice(2, 10), // Placeholder
                timestamp: new Date().toISOString()
            }
        };

        // Ajouter au registre et marquer comme "vu"
        registry.push(newEntity);
        seenInThisRun.add(cleanName);
        
        // Créer le fichier HTML vide (sera rempli par update-html-content.cjs)
        const htmlPath = path.join(auditsDir, fileName);
        if (!fs.existsSync(htmlPath)) {
            fs.writeFileSync(htmlPath, ``);
        }
        
        newCount++;
    });

    // 5. Sauvegarde
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));

    console.log("--------------------------------------------------");
    console.log(`✅ Forge terminée avec succès !`);
    console.log(`✨ Nouveaux audits créés : ${newCount}`);
    console.log(`🚫 Doublons ignorés     : ${duplicateCount}`);
    console.log(`📈 Total final registre : ${registry.length}`);
    console.log("--------------------------------------------------");
}

forge().catch(console.error);