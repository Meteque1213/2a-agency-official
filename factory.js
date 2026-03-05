import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import fs from 'fs';

// CONFIGURATION DU COMPTE
const PRIVATE_KEY = process.env.PRIVATE_KEY; 
const account = privateKeyToAccount(PRIVATE_KEY);

const client = createWalletClient({
  account,
  chain: base,
  transport: http('https://mainnet.base.org')
}).extend(publicActions);

// LA LISTE AVEC LES VRAIS SCORES (ZÉRO COMPROMIS)
const brands = [
    { name: "Hermès", score: 98 }, { name: "Patek Philippe", score: 97 }, { name: "Loro Piana", score: 96 },
    { name: "Brunello Cucinelli", score: 95 }, { name: "Vacheron Constantin", score: 94 }, { name: "Cartier", score: 94 },
    { name: "Rolex", score: 93 }, { name: "Audemars Piguet", score: 93 }, { name: "Chanel", score: 92 },
    { name: "Louis Vuitton", score: 91 }, { name: "Van Cleef & Arpels", score: 91 }, { name: "Dior", score: 90 },
    { name: "Breguet", score: 90 }, { name: "Jaeger-LeCoultre", score: 89 }, { name: "IWC Schaffhausen", score: 88 },
    { name: "Omega", score: 88 }, { name: "Prada", score: 87 }, { name: "Saint Laurent", score: 87 },
    { name: "Celine", score: 86 }, { name: "Bottega Veneta", score: 86 }, { name: "Loewe", score: 85 },
    { name: "Gucci", score: 84 }, { name: "Valentino", score: 84 }, { name: "Tiffany & Co.", score: 83 },
    { name: "Burberry", score: 82 }, { name: "Fendi", score: 82 }, { name: "Max Mara", score: 81 },
    { name: "Zegna", score: 81 }, { name: "The Row", score: 80 }, { name: "Alaïa", score: 80 },
    { name: "Moncler", score: 79 }, { name: "Givenchy", score: 78 }, { name: "Balmain", score: 78 },
    { name: "Tom Ford", score: 77 }, { name: "Salvatore Ferragamo", score: 77 }, { name: "Etro", score: 76 },
    { name: "Missoni", score: 76 }, { name: "Ralph Lauren", score: 75 }, { name: "Giorgio Armani", score: 75 },
    { name: "Tory Burch", score: 74 }, { name: "Coach", score: 73 }, { name: "Michael Kors", score: 72 },
    { name: "Longchamp", score: 71 }, { name: "Bally", score: 70 }, { name: "Tod’s", score: 70 },
    { name: "Jimmy Choo", score: 69 }, { name: "Manolo Blahnik", score: 69 }, { name: "Christian Louboutin", score: 68 },
    { name: "Hugo Boss", score: 67 }, { name: "Dolce & Gabbana", score: 66 }, { name: "Versace", score: 65 },
    { name: "Philipp Plein", score: 42 }, { name: "Goyard", score: 46 }, { name: "Balenciaga", score: 50 },
    { name: "Off-White", score: 64 }, { name: "Alexander McQueen", score: 79 }, { name: "Jacquemus", score: 82 },
    { name: "Miu Miu", score: 83 }, { name: "Stone Island", score: 85 }, { name: "Ami Paris", score: 84 },
    { name: "Acne Studios", score: 78 }, { name: "Vetements", score: 65 }, { name: "Rick Owens", score: 87 },
    { name: "Dries Van Noten", score: 89 }, { name: "JW Anderson", score: 81 }, { name: "Isabel Marant", score: 80 },
    { name: "Chloé", score: 82 }, { name: "Maison Margiela", score: 88 }, { name: "Kenzo", score: 74 },
    { name: "Paul Smith", score: 77 }, { name: "Dsquared2", score: 61 }, { name: "Moschino", score: 63 },
    { name: "Palm Angels", score: 59 }, { name: "Fear of God", score: 82 }, { name: "Sacai", score: 86 },
    { name: "Comme des Garçons", score: 90 }, { name: "Thom Browne", score: 88 }, { name: "Marine Serre", score: 83 },
    { name: "Coperni", score: 81 }, { name: "Skims", score: 68 }, { name: "Mugler", score: 84 },
    { name: "Schiaparelli", score: 91 }, { name: "Paco Rabanne", score: 79 }, { name: "Lanvin", score: 85 },
    { name: "Diesel", score: 66 }, { name: "Ganni", score: 72 }, { name: "Zimmermann", score: 75 },
    { name: "Reformation", score: 84 }, { name: "Bulgari", score: 89 }, { name: "Piaget", score: 91 },
    { name: "Chopard", score: 87 }, { name: "Tag Heuer", score: 81 }, { name: "Hublot", score: 78 },
    { name: "Montblanc", score: 85 }, { name: "Swarovski", score: 70 }, { name: "Pandora", score: 62 },
    { name: "Moncler Genius", score: 80 }, { name: "Supreme", score: 76 }, { name: "Oscar de la Renta", score: 89 },
    { name: "Diane von Furstenberg", score: 82 }, { name: "Marc Jacobs", score: 77 }, { name: "Roberto Cavalli", score: 64 }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
    console.log("🔥 2A AGENCY - RÉAMORÇAGE ESM ACTIVÉ 🔥");
    let dbResults = [];

    for (let i = 0; i < brands.length; i++) {
        const brand = brands[i];
        try {
            const nonce = await client.getTransactionCount({ address: account.address });
            
            const hash = await client.sendTransaction({
                to: account.address,
                data: `0x${Buffer.from(`Forensic Audit 2A Agency: ${brand.name} | Score: ${brand.score}`).toString('hex')}`,
                nonce: nonce
            });

            console.log(`💎 [${i+1}/101] ${brand.name} -> SCORE: ${brand.score} | Hash: ${hash}`);
            dbResults.push({ name: brand.name, score: brand.score, category: "Luxury", hash: hash });
            await sleep(2500); 

        } catch (e) {
            console.error(`❌ Erreur sur ${brand.name}: ${e.message}`);
            await sleep(5000);
            i--; 
        }
    }
    // Écriture pour database.js (sans export pour être compatible avec ton script HTML classique)
    fs.writeFileSync('database.js', `const registryData = ${JSON.stringify(dbResults, null, 4)};`);
    console.log("🚀 MISSION ACCOMPLIE.");
}

run();