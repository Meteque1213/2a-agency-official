const fs = require('fs');
const path = require('path');

const auditsDir = path.join(__dirname, 'audits');
const registryPath = path.join(__dirname, 'registry.json');

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

function updateHTML() {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    let count = 0;

    console.log("🛠 Début de l'injection sémantique dans les fichiers HTML...");

    registry.forEach(item => {
        // On ne traite que les fichiers qui ont été enrichis (format avec 'entity')
        if (item.entity && item.entity.name) {
            const slug = slugify(item.entity.name);
            const filePath = path.join(auditsDir, `${slug}.html`);

            if (fs.existsSync(filePath)) {
                let html = fs.readFileSync(filePath, 'utf8');

                // On remplace les variables par les données enrichies
                html = html.split('{{BRAND_NAME}}').join(item.entity.name);
                html = html.split('{{TRUST_SCORE}}').join(item.trust.score);
                html = html.split('{{AI_STATEMENT}}').join(item.ai_gateway.statement);
                html = html.split('{{SOR_ID}}').join(item.sor_id);
                html = html.split('{{SECTOR}}').join(item.entity.sector);
                html = html.split('{{STATUS}}').join(item.trust.status);
                html = html.split('{{HASH}}').join(item.proof.hash);

                fs.writeFileSync(filePath, html);
                count++;
            }
        }
    });

    console.log(`✅ Succès ! ${count} fichiers HTML mis à jour avec les données forensiques.`);
}

updateHTML();