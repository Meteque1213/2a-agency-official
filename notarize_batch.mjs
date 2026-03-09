import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function notarizeBatch() {
    console.log("🦁 [SYSTEM] SENTINEL-01 : Notarisation Globale du Registre (198 Audits)...");

    try {
        // 1. Charger le rapport complet
        const reportPath = "./global_audit_report.json";
        if (!fs.existsSync(reportPath)) {
            throw new Error("❌ Le fichier global_audit_report.json est introuvable. Lance l'orchestrateur d'abord.");
        }
        const reportData = fs.readFileSync(reportPath, "utf8");
        
        // 2. Créer l'empreinte unique
        const batchHash = ethers.keccak256(ethers.toUtf8Bytes(reportData));
        console.log(`📑 Empreinte Globale (Hash) : ${batchHash}`);

        // 3. Connexion Base Mainnet
        const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
        
        if (!process.env.PRIVATE_KEY) {
            throw new Error("PRIVATE_KEY manquante dans le .env");
        }

        const rawKey = process.env.PRIVATE_KEY.trim();
        const formattedKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
        const wallet = new ethers.Wallet(formattedKey, provider);

        console.log(`👛 Signature via Wallet : ${wallet.address}`);
        console.log("🚀 Envoi de l'ancre d'intégrité sur Base L2...");

        // 4. Transaction (Ancre de données)
        const tx = await wallet.sendTransaction({
            to: wallet.address,
            value: 0,
            data: batchHash 
        });

        console.log(`\n💎 REGISTRE CERTIFIÉ !`);
        console.log(`🔗 Transaction Hash : ${tx.hash}`);
        console.log(`🌍 Vérification publique : https://basescan.org/tx/${tx.hash}`);

    } catch (error) {
        console.error("\n❌ ÉCHEC NOTARISATION :");
        console.error(error.message);
    }
}

notarizeBatch();