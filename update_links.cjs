const fs = require('fs');
const path = require('path');

const auditsDir = path.join(__dirname, 'audits');
const files = fs.readdirSync(auditsDir);
const auditsPagePath = path.join(__dirname, 'audits.html');

let auditsPageContent = fs.readFileSync(auditsPagePath, 'utf8');

// On parcourt les fichiers renommés pour mettre à jour la page centrale
files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(auditsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // On récupère le SOR_ID à l'intérieur du fichier
        const idMatch = content.match(/SOR_ID:\s*([A-Z0-9-]+)/);
        if (idMatch && idMatch[1]) {
            const sorId = idMatch[1];
            // On remplace l'ancien lien (ID.html) par le nouveau (brand.html) dans audits.html
            const oldLink = `${sorId}.html`;
            const newLink = `audits/${file}`;
            
            // On remplace globalement dans le fichier central
            const regex = new RegExp(`href=["'](?:audits/)?${oldLink}["']`, 'g');
            auditsPageContent = auditsPageContent.replace(regex, `href="${newLink}"`);
        }
    }
});

fs.writeFileSync(auditsPagePath, auditsPageContent);
console.log("✅ Liens mis à jour dans audits.html");