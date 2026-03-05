import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import fs from 'fs'; 
import 'dotenv/config';

// CONFIGURATION DU WALLET
const rawKey = process.env.PRIVATE_KEY;
const formattedKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
const account = privateKeyToAccount(formattedKey);
const client = createWalletClient({ 
    account, 
    chain: base, 
    transport: http(process.env.RPC_URL) 
}).extend(publicActions);

// LA LISTE DES 100 MARQUES RÉELLES
const brands = [
    { name: "Hermès", score: 98, category: "Leather Goods" },
    { name: "Patek Philippe", score: 97, category: "Watches" },
    { name: "Loro Piana", score: 96, category: "Fashion" },
    { name: "Brunello Cucinelli", score: 95, category: "Fashion" },
    { name: "Cartier", score: 95, category: "Jewelry" },
    { name: "Rolex", score: 94, category: "Watches" },
    { name: "Vacheron Constantin", score: 94, category: "Watches" },
    { name: "Van Cleef & Arpels", score: 93, category: "Jewelry" },
    { name: "Audemars Piguet", score: 93, category: "Watches" },
    { name: "Ferrari", score: 92, category: "Automotive" },
    { name: "Aman Resorts", score: 92, category: "Hotels" },
    { name: "Chanel", score: 91, category: "Fashion" },
    { name: "Cheval Blanc Hotels", score: 91, category: "Hotels" },
    { name: "Louis Vuitton", score: 90, category: "Fashion" },
    { name: "Breguet", score: 90, category: "Watches" },
    { name: "Dior", score: 89, category: "Fashion" },
    { name: "Oetker Collection", score: 89, category: "Hotels" },
    { name: "Riva Yachts", score: 89, category: "Yachting" },
    { name: "Clarridge's", score: 89, category: "Hotels" },
    { name: "Louis XIII", score: 89, category: "Spirits" },
    { name: "Dom Pérignon", score: 86, category: "Spirits" },
    { name: "Bentley", score: 88, category: "Automotive" },
    { name: "Rolls-Royce", score: 88, category: "Automotive" },
    { name: "Leica", score: 88, category: "Tech" },
    { name: "Hôtel de Crillon", score: 88, category: "Hotels" },
    { name: "Maybourne Hotel Group", score: 88, category: "Hotels" },
    { name: "Lürssen Yachts", score: 87, category: "Yachting" },
    { name: "Boucheron", score: 87, category: "Jewelry" },
    { name: "Belmond", score: 87, category: "Hotels" },
    { name: "Eden Rock", score: 87, category: "Hotels" },
    { name: "Feadship", score: 86, category: "Yachting" },
    { name: "Assouline", score: 86, category: "Publishing" },
    { name: "Soneva", score: 86, category: "Hotels" },
    { name: "Krug", score: 85, category: "Spirits" },
    { name: "Steinway & Sons", score: 85, category: "Instruments" },
    { name: "Dassault Falcon", score: 85, category: "Aviation" },
    { name: "Rosewood", score: 85, category: "Hotels" },
    { name: "Berluti", score: 84, category: "Leather Goods" },
    { name: "NetJets", score: 84, category: "Aviation" },
    { name: "Mandarin Oriental", score: 84, category: "Hotels" },
    { name: "La Réserve", score: 84, category: "Hotels" },
    { name: "Annabel's", score: 84, category: "Private Club" },
    { name: "Gulfstream", score: 83, category: "Aviation" },
    { name: "Four Seasons", score: 83, category: "Hotels" },
    { name: "Six Senses", score: 83, category: "Hotels" },
    { name: "Ritz-Carlton", score: 82, category: "Hotels" },
    { name: "Macallan", score: 82, category: "Spirits" },
    { name: "Wally Yachts", score: 82, category: "Yachting" },
    { name: "The Dorchester", score: 82, category: "Hotels" },
    { name: "Saint Laurent", score: 81, category: "Fashion" },
    { name: "Baccarat", score: 81, category: "Lifestyle" },
    { name: "One&Only", score: 81, category: "Hotels" },
    { name: "Prada", score: 80, category: "Fashion" },
    { name: "Gucci", score: 79, category: "Fashion" },
    { name: "Lalique", score: 79, category: "Lifestyle" },
    { name: "St. Regis", score: 79, category: "Hotels" },
    { name: "Balenciaga", score: 78, category: "Fashion" },
    { name: "Rimowa", score: 78, category: "Travel" },
    { name: "Benetti", score: 78, category: "Yachting" },
    { name: "Embraer", score: 78, category: "Aviation" },
    { name: "Valentino", score: 77, category: "Fashion" },
    { name: "Lamborghini", score: 77, category: "Automotive" },
    { name: "Christofle", score: 77, category: "Lifestyle" },
    { name: "Cipriani", score: 77, category: "Dining" },
    { name: "Aston Martin", score: 76, category: "Automotive" },
    { name: "Hennessy", score: 76, category: "Spirits" },
    { name: "Bvlgari Hotels", score: 76, category: "Hotels" },
    { name: "Bulgari", score: 75, category: "Jewelry" },
    { name: "Tiffany & Co.", score: 74, category: "Jewelry" },
    { name: "Moncler", score: 74, category: "Fashion" },
    { name: "Taschen", score: 74, category: "Publishing" },
    { name: "Hublot", score: 73, category: "Watches" },
    { name: "Panerai", score: 72, category: "Watches" },
    { name: "Bang & Olufsen", score: 72, category: "Audio" },
    { name: "Cessna", score: 72, category: "Aviation" },
    { name: "Omega", score: 71, category: "Watches" },
    { name: "Azimut", score: 71, category: "Yachting" },
    { name: "Fendi", score: 70, category: "Fashion" },
    { name: "Post Oak Hotel", score: 70, category: "Hotels" },
    { name: "Givenchy", score: 69, category: "Fashion" },
    { name: "Celine", score: 68, category: "Fashion" },
    { name: "Wedgwood", score: 68, category: "Lifestyle" },
    { name: "Nobu Hotels", score: 68, category: "Hotels" },
    { name: "Loewe", score: 67, category: "Fashion" },
    { name: "Bottega Veneta", score: 66, category: "Fashion" },
    { name: "Tom Ford", score: 65, category: "Fashion" },
    { name: "Burberry", score: 65, category: "Fashion" },
    { name: "IWC", score: 64, category: "Watches" },
    { name: "Richard Mille", score: 63, category: "Watches" },
    { name: "Chopard", score: 62, category: "Jewelry" },
    { name: "Brioni", score: 61, category: "Fashion" },
    { name: "Soho House", score: 61, category: "Private Club" },
    { name: "Pagani", score: 59, category: "Automotive" },
    { name: "Harry Winston", score: 58, category: "Jewelry" },
    { name: "Graff", score: 54, category: "Jewelry" },
    { name: "Maserati", score: 51, category: "Automotive" },
    { name: "Zilli", score: 46, category: "Fashion" },
    { name: "Stefano Ricci", score: 45, category: "Fashion" },
    { name: "Goyard", score: 42, category: "Leather Goods" },
    { name: "Philipp Plein", score: 38, category: "Fashion" }
];

async function runAudit() {
    let finalData = [];
    console.log("🦁 Lancement de l'audit blockchain pour les 100 entités...");

    for (const brand of brands) {
        try {
            // Envoi de la transaction sur Base
            const hash = await client.sendTransaction({
                to: account.address,
                data: Buffer.from(`2A Audit: ${brand.name} | Integrity Score: ${brand.score}`).toString('hex')
            });
            
            finalData.push({ ...brand, hash });
            console.log(`✅ ${brand.name.padEnd(25)} | Score: ${brand.score} | Certifié`);
            
            // Attente pour éviter les problèmes de nonce sur le réseau
            await new Promise(r => setTimeout(r, 800)); 
        } catch (e) {
            console.error(`❌ Erreur sur ${brand.name}:`, e.message);
        }
    }

    // GÉNÉRATION DU FICHIER DE DONNÉES POUR LE SITE
    const fileContent = `const registryData = ${JSON.stringify(finalData, null, 4)};`;
    fs.writeFileSync('database.js', fileContent);
    console.log("\n🚀 TERMINÉ !");
    console.log("Le fichier database.js a été généré avec les 100 certifications.");
}

runAudit();