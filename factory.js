import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import fs from 'fs'; 
import 'dotenv/config';

const rawKey = process.env.PRIVATE_KEY;
const formattedKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
const account = privateKeyToAccount(formattedKey);
const client = createWalletClient({ account, chain: base, transport: http(process.env.RPC_URL) }).extend(publicActions);

// LA LISTE COMPLÈTE DES 100 MARQUES
const brands = [
    // --- ELITES (90+) ---
    { name: "Hermès", score: 96, category: "Leather Goods" },
    { name: "Patek Philippe", score: 95, category: "Watches" },
    { name: "Cartier", score: 94, category: "Jewelry" },
    { name: "Rolex", score: 94, category: "Watches" },
    { name: "Brunello Cucinelli", score: 94, category: "Fashion" },
    { name: "Loro Piana", score: 93, category: "Fashion" },
    { name: "Ferrari", score: 92, category: "Automotive" },
    { name: "Aman Resorts", score: 92, category: "Hotels" },
    { name: "Van Cleef & Arpels", score: 92, category: "Jewelry" },
    { name: "Gulfstream", score: 90, category: "Aviation" },
    { name: "Lamborghini", score: 91, category: "Automotive" },
    { name: "Louis Vuitton", score: 93, category: "Fashion" },
    { name: "Chanel", score: 92, category: "Fashion" },
    { name: "Audemars Piguet", score: 91, category: "Watches" },
    { name: "Boucheron", score: 90, category: "Jewelry" },
    { name: "Cheval Blanc", score: 93, category: "Hotels" },

    // --- MOYENS / WARNING (65-89) ---
    { name: "Dior", score: 88, category: "Fashion" },
    { name: "Macallan", score: 87, category: "Spirits" },
    { name: "Bentley", score: 86, category: "Automotive" },
    { name: "NetJets", score: 82, category: "Aviation" },
    { name: "Lürssen Yachts", score: 85, category: "Yachting" },
    { name: "Four Seasons", score: 84, category: "Hotels" },
    { name: "Dom Pérignon", score: 89, category: "Spirits" },
    { name: "Range Rover", score: 81, category: "Automotive" },
    { name: "Gucci", score: 78, category: "Fashion" },
    { name: "Prada", score: 79, category: "Fashion" },
    { name: "Saint Laurent", score: 77, category: "Fashion" },
    { name: "Feadship", score: 84, category: "Yachting" },
    { name: "Bombardier", score: 79, category: "Aviation" },
    { name: "Ritz Paris", score: 85, category: "Hotels" },
    { name: "Bulgari", score: 82, category: "Jewelry" },
    { name: "Vacheron Constantin", score: 88, category: "Watches" },

    // --- RED FLAGS / CRITIQUE (Sous 60 - TON IMPACT BUSINESS) ---
    { name: "Goyard", score: 42, category: "Leather Goods" },
    { name: "Stefano Ricci", score: 47, category: "Fashion" },
    { name: "Graff", score: 54, category: "Jewelry" },
    { name: "Brioni", score: 58, category: "Fashion" },
    { name: "Breguet", score: 52, category: "Watches" },
    { name: "Berluti", score: 59, category: "Fashion" },
    { name: "Zilli", score: 45, category: "Fashion" },
    { name: "Hublot", score: 55, category: "Watches" },
    { name: "Richard Mille", score: 58, category: "Watches" },
    { name: "Harry Winston", score: 53, category: "Jewelry" },
    { name: "Maserati", score: 51, category: "Automotive" },
    { name: "Pagani", score: 56, category: "Automotive" },
    { name: "Falcon Aviation", score: 49, category: "Aviation" },
    { name: "Oceanco", score: 57, category: "Yachting" },
    { name: "Baccarat", score: 54, category: "Home Decor" },
    { name: "Lalique", score: 52, category: "Home Decor" },

    // Remplissage automatique pour atteindre 100
    ...Array.from({ length: 52 }, (_, i) => ({
        name: `Entity Premium ${i + 49}`,
        score: Math.floor(Math.random() * (95 - 40) + 40),
        category: "Luxury Services"
    }))
];

async function runAudit() {
    let finalData = [];
    console.log("🦁 Certification en cours pour les 100 marques...");

    for (const brand of brands) {
        try {
            const hash = await client.sendTransaction({
                to: account.address,
                data: Buffer.from(`2A Audit: ${brand.name} | Score: ${brand.score}`).toString('hex')
            });
            
            finalData.push({ ...brand, hash });
            console.log(`✅ ${brand.name.padEnd(20)} | Score: ${brand.score} | Certifié`);
            await new Promise(r => setTimeout(r, 1000)); // Pause pour le nonce
        } catch (e) { console.error(`Erreur ${brand.name}:`, e.message); }
    }

    const fileContent = `const registryData = ${JSON.stringify(finalData, null, 4)};`;
    fs.writeFileSync('database.js', fileContent);
    console.log("🚀 Fichier database.js généré avec 100 marques !");
}

runAudit();