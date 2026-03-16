const axios = require('axios');
const fs = require('fs');

async function run() {
    console.log("🚀 SENTINEL-FREE : Tentative via Sitemap XML...");
    
    // L'URL du sitemap qui contient les entreprises
    const sitemapUrl = "https://www.bcorporation.net/en-us/find-a-b-corp/sitemap.xml";

    try {
        const { data } = await axios.get(sitemapUrl);
        
        // On cherche toutes les URLs qui contiennent "/company/"
        const companyUrls = data.match(/https:\/\/www\.bcorporation\.net\/en-us\/find-a-b-corp\/company\/[^\s<]+/g);

        if (companyUrls && companyUrls.length > 0) {
            // On nettoie les URLs pour ne garder que le nom à la fin
            const names = companyUrls.map(url => {
                const parts = url.split('/');
                return parts[parts.length - 2].replace(/-/g, ' ').toUpperCase();
            });

            const uniqueNames = [...new Set(names)];
            fs.writeFileSync('FREE_EXTRACTED_NAMES.txt', uniqueNames.join('\n'));
            
            console.log(`✅ SUCCÈS ! ${uniqueNames.length} entreprises extraites du sitemap.`);
        } else {
            console.log("❌ Le sitemap n'a pas renvoyé de liens 'company'.");
        }
    } catch (error) {
        console.error("❌ Erreur d'accès au sitemap :", error.message);
    }
}

run();