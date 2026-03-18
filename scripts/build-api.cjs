const fs = require('fs');
const path = require('path');

// Chemins de configuration
const REGISTRY_PATH = path.join(__dirname, '../registry.json');
const API_DIST_PATH = path.join(__dirname, '../api');

async function build() {
    console.log("🚀 Initialisation du Notary Engine (2A Agency - v1.2)...");

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
    const publicUrls = [];

    // 3. Boucler sur chaque entité
    data.forEach(item => {
        // Créer un slug propre
        const slug = item.entity.name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]/g, '')
            .replace(/--+/g, '-');

        const entityFolder = path.join(API_DIST_PATH, slug);
        const baseUrl = `https://2a-agency-official.vercel.app/api/${slug}`;
        
        fs.mkdirSync(entityFolder, { recursive: true });
        
        const jsonContent = JSON.stringify(item, null, 2);

        // Double Génération : JSON + TXT
        fs.writeFileSync(path.join(entityFolder, 'index.json'), jsonContent);
        fs.writeFileSync(path.join(entityFolder, 'index.txt'), jsonContent);

        entitiesList.push(`${baseUrl}/index.json`);
        publicUrls.push(`${baseUrl}/index.txt`);
    });

    // 4. Générer le Sommaire (Root Index)
    const rootIndex = {
        api_version: "1.2",
        protocol: "2A-SoR-v2.1",
        last_update: new Date().toISOString(),
        status: "OPERATIONAL",
        total_entities: data.length,
        endpoints: {
            root: "https://2a-agency-official.vercel.app/api/index.json",
            sitemap: "https://2a-agency-official.vercel.app/api/sitemap.xml",
            entities_list: "https://2a-agency-official.vercel.app/api/all-entities.txt",
            registry: "https://2aagency.com/registry.json"
        }
    };

    const rootContent = JSON.stringify(rootIndex, null, 2);
    fs.writeFileSync(path.join(API_DIST_PATH, 'index.json'), rootContent);
    fs.writeFileSync(path.join(API_DIST_PATH, 'index.txt'), rootContent);

    // 5. GÉNÉRATION DU SITEMAP XML (Pour Google)
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://2a-agency-official.vercel.app/api/index.json</loc></url>
  ${publicUrls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(API_DIST_PATH, 'sitemap.xml'), sitemapContent);
    
    // 6. GÉNÉRATION DE LA LISTE TXT GLOBALE (Pour les IA)
    fs.writeFileSync(path.join(API_DIST_PATH, 'all-entities.txt'), publicUrls.join('\n'));

    console.log(`\n✨ TERMINE : ${data.length} entités traitées.`);
    console.log(`🗺️  Sitemap généré : /api/sitemap.xml`);
    console.log(`📜  Liste globale générée : /api/all-entities.txt`);
}

build();