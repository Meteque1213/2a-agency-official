import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import fs from 'fs'; // Pour écrire le fichier
import 'dotenv/config';

const account = privateKeyToAccount(process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : `0x${process.env.PRIVATE_KEY}`);
const client = createWalletClient({ account, chain: base, transport: http(process.env.RPC_URL) }).extend(publicActions);

const brands = [
    { name: "Hermès", score: 96, category: "Leather Goods" },
    { name: "Patek Philippe", score: 95, category: "Watches" },
    { name: "Cartier", score: 94, category: "Jewelry" },
    { name: "Loro Piana", score: 93, category: "Fashion" },
    { name: "Goyard", score: 42, category: "Leather Goods" },
    { name: "Stefano Ricci", score: 47, category: "Fashion" },
    { name: "Graff", score: 54, category: "Jewelry" },
    { name: "Brioni", score: 58, category: "Fashion" },
    { name: "NetJets", score: 82, category: "Aviation" },
    { name: "Lürssen Yachts", score: 85, category: "Yachting" }
    // Ajoute ici tes 100 marques !
];

async function runAudit() {
    let finalData = [];
    console.log("🦁 Certification en cours...");

    for (const brand of brands) {
        try {
            const hash = await client.sendTransaction({
                to: account.address,
                data: Buffer.from(`Audit 2A Agency | ${brand.name}`).toString('hex')
            });
            
            finalData.push({ ...brand, hash });
            console.log(`✅ ${brand.name} certifié.`);
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) { console.error(`Erreur ${brand.name}:`, e.message); }
    }

    // ON GÉNÈRE LE FICHIER DE DONNÉES POUR LE SITE
    const fileContent = `const registryData = ${JSON.stringify(finalData, null, 4)};`;
    fs.writeFileSync('database.js', fileContent);
    console.log("🚀 Fichier database.js généré avec succès !");
}

runAudit();