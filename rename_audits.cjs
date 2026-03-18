const fs = require('fs');
const path = require('path');

const auditsDir = path.join(__dirname, 'audits');
const files = fs.readdirSync(auditsDir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(auditsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // On cherche le nom de la marque après "Audit Report: "
        const match = content.match(/Audit Report:\s*([^<]+)/);
        
        if (match && match[1]) {
            let brandName = match[1].trim()
                .toLowerCase()
                .replace(/\s+/g, '-') // Espace -> tiret
                .replace(/[^a-z0-9-]/g, ''); // Supprime les caractères spéciaux
            
            const newFileName = `${brandName}.html`;
            const newPath = path.join(auditsDir, newFileName);
            
            if (filePath !== newPath) {
                fs.renameSync(filePath, newPath);
                console.log(`Renamed: ${file} -> ${newFileName}`);
            }
        }
    }
});