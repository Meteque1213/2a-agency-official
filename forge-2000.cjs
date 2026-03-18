const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'master-template.html');
const auditsDir = path.join(__dirname, 'audits');
const registryPath = path.join(__dirname, 'registry.json');
const sourceFile = path.join(__dirname, 'FINAL_LIST.txt'); 

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

function forge() {
    console.log("🛡️ Vérification du registre actuel...");
    
    const template = fs.readFileSync(templatePath, 'utf8');
    let registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    const rawNames = fs.readFileSync(sourceFile, 'utf8').split('\n');

    // On crée un Set des noms existants pour une détection de doublons ultra-précise
    const existingNames = new Set(
        registry
            .filter(item => item && item.memo)
            .map(item => item.memo.toLowerCase().trim())
    );
    
    let count = 0;
    // On reprend l'incrémentation APRES le dernier élément du registre
    let nextIndex = registry.length; 

    console.log(`🔍 ${existingNames.size} entités déjà protégées dans le registre. Début de la forge...`);

    rawNames.forEach((line) => {
        const brandName = line.trim();
        if (!brandName || brandName.length < 2) return; 

        const brandLower = brandName.toLowerCase();

        // 🛡️ PROTECTION ANTI-DOUBLONS
        if (!existingNames.has(brandLower)) {
            const slug = slugify(brandName);
            if (!slug) return;

            const fileName = `${slug}.html`;
            const filePath = path.join(auditsDir, fileName);
            
            // On génère un ID unique dans la continuité
            const newId = `2A-AUTO-${String(nextIndex + 1).padStart(4, '0')}`;

            // 1. Génération du HTML
            let content = template.split('{{BRAND_NAME}}').join(brandName);
            content = content.split('{{SOR_ID}}').join(newId);
            
            // On n'écrit le fichier que s'il n'existe pas physiquement non plus
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, content);
            }

            // 2. Ajout au registre avec l'écriture exacte d'hier
            registry.push({
                id: newId,
                memo: brandName,
                status: "STABLE",
                category: "Audit 2026 / Expansion"
            });

            existingNames.add(brandLower);
            nextIndex++;
            count++;
        }
    });

    // 3. Sauvegarde (formatage JSON identique à hier avec 4 espaces)
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 4));
    
    console.log(`✅ Mission accomplie !`);
    console.log(`📊 ${count} nouveaux audits ajoutés sans toucher aux précédents.`);
    console.log(`📈 Total final du System of Record : ${registry.length}`);
}

try {
    forge();
} catch (error) {
    console.error("❌ Erreur de sécurité :", error.message);
}