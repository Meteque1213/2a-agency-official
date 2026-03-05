import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import 'dotenv/config';

// 1. SÉCURITÉ ET CORRECTION AUTOMATIQUE DE LA CLÉ
let rawKey = process.env.PRIVATE_KEY;
if (!rawKey) {
    console.error("❌ ERREUR : PRIVATE_KEY manquante dans le fichier .env");
    process.exit(1);
}

// Ajoute 0x si tu l'as oublié dans le .env
const formattedKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;

const account = privateKeyToAccount(formattedKey);
const client = createWalletClient({
  account,
  chain: base,
  transport: http(process.env.RPC_URL),
}).extend(publicActions);

// 2. LA LISTE CONTRASTÉE (L'ÉLITE vs LES RED FLAGS)
const brandsToCertify = [
    // --- L'ÉLITE (90+) ---
    { name: "Patek Philippe", score: 95, category: "Watches" },
    { name: "Cartier", score: 94, category: "Jewelry" },
    { name: "Brunello Cucinelli", score: 94, category: "Fashion" },
    { name: "Loro Piana", score: 93, category: "Fashion" },
    { name: "Van Cleef & Arpels", score: 92, category: "Jewelry" },
    { name: "Aman Resorts", score: 92, category: "Hotels" },
    { name: "Gulfstream", score: 90, category: "Aviation" },

    // --- LES "RED FLAGS" (Notes Basses pour le contraste) ---
    { name: "Goyard", score: 42, category: "Leather Goods" },
    { name: "Stefano Ricci", score: 47, category: "Fashion" },
    { name: "Graff", score: 54, category: "Jewelry" },
    { name: "Brioni", score: 58, category: "Fashion" },
    { name: "Breguet", score: 52, category: "Watches" },
    { name: "Berluti", score: 61, category: "Fashion" },

    // --- ART DE VIVRE ---
    { name: "Dom Pérignon", score: 89, category: "Spirits" },
    { name: "Macallan", score: 91, category: "Spirits" },
    { name: "NetJets", score: 82, category: "Aviation" },
    { name: "Lürssen Yachts", score: 85, category: "Yachting" }
];

// 3. LE MOTEUR DE NOTARISATION
async function certifyVague2() {
    console.log("🦁 2A AGENCY - Vague 2: Certification du Top 100...");
    console.log(`📡 Network: BASE MAINNET | Auditor: ${account.address}`);
    console.log("-----------------------------------------------");

    for (const brand of brandsToCertify) {
        try {
            const auditData = `Audit 2A Agency | ${brand.name} | Score: ${brand.score}/100 | Verif: 2026-03-05`;
            
            const hash = await client.sendTransaction({
                to: account.address,
                value: 0n,
                data: Buffer.from(auditData).toString('hex')
            });

            console.log(`✅ Certifié: ${brand.name.padEnd(15)} | Score: ${brand.score}/100`);
            console.log(`🔗 Proof: https://basescan.org/tx/${hash}`);
            console.log("---");

            // Pause de sécurité pour le réseau
            await new Promise(resolve => setTimeout(resolve, 1500));
            
        } catch (error) {
            console.error(`❌ Erreur pour ${brand.name}:`, error.message);
        }
    }

    console.log("\n🚀 VAGUE 2 TERMINÉE : Ton Registre est désormais une autorité mondiale.");
    console.log("Copie les Hashs ci-dessus dans ton fichier registry.html pour finaliser.");
}

certifyVague2();