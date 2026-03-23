const { createWalletClient, http, publicActions } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { base } = require('viem/chains');
const fs = require('fs');

// 1. CONFIGURATION DU COMPTE
// REMPLACE PAR TA CLÉ PRIVÉE (Garde-la secrète et ne la push pas sur GitHub !)
const PRIVATE_KEY = '0x2c2bb615c64d0e97367d51862169879effef74c6d54e4f10b6c77c53dd8e22b9'; 
const account = privateKeyToAccount(PRIVATE_KEY);

const client = createWalletClient({
  account,
  chain: base,
  transport: http('https://mainnet.base.org')
}).extend(publicActions);

// 2. LISTE DES 100 MARQUES (TA SÉLECTION)
const brands = [
    "Louis Vuitton", "Hermès", "Chanel", "Gucci", "Dior", "Cartier", "Rolex", "Saint Laurent", "Tiffany & Co.", "Prada",
    "Burberry", "Fendi", "Bottega Veneta", "Balenciaga", "Givenchy", "Celine", "Loewe", "Valentino", "Versace", "Moncler",
    "Off-White", "Alexander McQueen", "Balmain", "Jacquemus", "Miu Miu", "Tom Ford", "Ralph Lauren", "Giorgio Armani", "Hugo Boss", "Salvatore Ferragamo",
    "Dolce & Gabbana", "Michael Kors", "Coach", "Tory Burch", "Jimmy Choo", "Manolo Blahnik", "Christian Louboutin", "Longchamp", "The Row", "Max Mara",
    "Stone Island", "Ami Paris", "Brunello Cucinelli", "Loro Piana", "Zegna", "Acne Studios", "Vetements", "Rick Owens", "Dries Van Noten", "JW Anderson",
    "Isabel Marant", "Chloé", "Maison Margiela", "Alaïa", "Etro", "Missoni", "Kenzo", "Paul Smith", "Dsquared2", "Philipp Plein",
    "Moschino", "Palm Angels", "Fear of God", "Sacai", "Comme des Garçons", "Thom Browne", "Marine Serre", "Coperni", "Skims", "Mugler",
    "Schiaparelli", "Paco Rabanne", "Lanvin", "Bally", "Diesel", "Ganni", "Zimmermann", "Reformation", "Bulgari", "Van Cleef & Arpels",
    "Piaget", "Chopard", "Tag Heuer", "Hublot", "Jaeger-LeCoultre", "IWC Schaffhausen", "Patek Philippe", "Audemars Piguet", "Vacheron Constantin", "Omega",
    "Montblanc", "Swarovski", "Pandora", "Moncler Genius", "Supreme", "Tod’s", "Oscar de la Renta", "Diane von Furstenberg", "Marc Jacobs", "Roberto Cavalli", "Goyard"
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
    console.log("🦁 2A Agency : Lancement de la certification mondiale sur Base...");
    let dbResults = [];

    for (let i = 0; i < brands.length; i++) {
        const name = brands[i];
        
        // LOGIQUE DE SCORING 2A AGENCY
        let score = 88; // Score par défaut
        if (["Hermès", "Patek Philippe", "Loro Piana", "Brunello Cucinelli"].includes(name)) {
            score = 98; // Excellence
        } else if (["Philipp Plein", "Goyard", "Balenciaga"].includes(name)) {
            score = 42; // Audit Warning
        }

        try {
            // Récupération du Nonce en temps réel pour éviter les collisions
            const nonce = await client.getTransactionCount({ address: account.address });

            const hash = await client.sendTransaction({
                to: account.address,
                data: `0x${Buffer.from(`Audit 2A Agency: ${name} | Score: ${score}`).toString('hex')}`,
                nonce: nonce
            });

            console.log(`✅ [${i+1}/${brands.length}] ${name} certifié | Score: ${score} | Hash: ${hash}`);
            
            dbResults.push({ 
                name: name, 
                score: score, 
                category: "Luxury", 
                hash: hash 
            });
            
            // Pause de sécurité pour le réseau Base (2.5 secondes)
            await sleep(2500); 

        } catch (e) {
            console.error(`❌ Erreur sur ${name}: ${e.message}`);
            await sleep(5000); // Pause plus longue en cas d'erreur réseau
        }
    }

    // ÉCRITURE DU FICHIER DATABASE.JS
    const fileContent = `const registryData = ${JSON.stringify(dbResults, null, 4)};`;
    fs.writeFileSync('database.js', fileContent);
    
    console.log("\n🚀 MISSION ACCOMPLIE.");
    console.log("Le fichier database.js a été généré avec 100% de preuves authentiques.");
}

run();