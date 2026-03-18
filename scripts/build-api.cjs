const fs = require('fs');
const path = require('path');

// Chemins de configuration
const REGISTRY_PATH = path.join(__dirname, '../registry.json');
const API_DIST_PATH = path.join(__dirname, '../api');

async function build() {
    console.log("🚀 Initialisation du Notary Engine (2A Agency)...");

    // 1. Lire le registre maître
    if (!fs.existsSync(REGISTRY_PATH)) {
        console.error("❌ Erreur : registry.json introuvable !");
        return;
    }
    const data = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
    
    // 2. Nettoyer/Créer le dossier API
    if (fs.existsSync(API_DIST_PATH)) {
        fs.rmSync(API_DIST_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(API_DIST_PATH);

    const entitiesList = [];

    // 3. Boucler sur chaque entité pour créer les dossiers
    data.forEach(item => {
        const slug = item.entity.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        const entityFolder = path.join(API_DIST_PATH, slug);
        const entityUrl = `https://2aagency.com/api/${slug}/index.json`;
        
        // Créer le dossier de l'entité
        fs.mkdirSync(entityFolder, { recursive: true });
        
        // Écrire le index.json spécifique
        fs.writeFileSync(
            path.join(entityFolder, 'index.json'), 
            JSON.stringify(item, null, 2)
        );

        entitiesList.push(entityUrl);
        console.log(`✅ Endpoint généré : /api/${slug}`);
    });

    // 4. Générer le Sommaire (Root Index)
    const rootIndex = {
        api_version: "1.0",
        protocol: "2A-SoR-v2.1",
        last_update: new Date().toISOString(),
        status: "OPERATIONAL",
        total_entities: data.length,
        endpoints: {
            root: "https://2aagency.com/api/index.json",
            registry: "https://2aagency.com/registry.json",
            entities: entitiesList
        }
    };

    fs.writeFileSync(
        path.join(API_DIST_PATH, 'index.json'), 
        JSON.stringify(rootIndex, null, 2)
    );

    console.log(`\n✨ TERMINE : ${data.length} endpoints créés avec succès.`);
}

build();