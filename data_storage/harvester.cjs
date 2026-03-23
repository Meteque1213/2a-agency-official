const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Filtres de taille d'entreprise (très différents des pages classiques)
    const sizes = ['1-9', '1000%2B', '50-249', '250-999'];

    console.log(`🕵️ SIZE-SHIFTER : Infiltration par segments de taille...`);

    for (const s of sizes) {
        try {
            const url = `https://www.bcorporation.net/en-us/find-a-b-corp/?company_size=${s}`;
            console.log(`🔍 Segment Taille : ${s}...`);

            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            await page.waitForSelector('.text-black.font-medium.text-xl', { timeout: 15000 });

            const names = await page.evaluate(() => {
                const elements = document.querySelectorAll('.text-black.font-medium.text-xl');
                return Array.from(elements).map(el => el.innerText.trim());
            });

            if (names.length > 0) {
                fs.appendFileSync('FREE_EXTRACTED_NAMES.txt', names.join('\n') + '\n');
                console.log(`✅ [${s}] : ${names.length} marques capturées.`);
            }
            await new Promise(r => setTimeout(r, 3000));
        } catch (error) {
            console.log(`⚠️ Échec sur le segment ${s}.`);
        }
    }
    await browser.close();
})();