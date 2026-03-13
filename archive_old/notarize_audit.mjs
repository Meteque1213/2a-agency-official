import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

// 1. Chargement du .env
dotenv.config();

async function notarizeAudit() {
    console.log("🦁 [SYSTEM] SENTINEL-01 : Notarisation du rapport Forensic...");

    try {
        // 2. Lecture du rapport d'audit
        const reportPath = "./audit_report.json";
        if (!fs.existsSync(reportPath)) {
            throw new Error("❌ Le fichier audit_report.json est introuvable.");
        }
        const report = fs.readFileSync(reportPath, "utf8");
        
        // 3. Création de l'empreinte numérique (Hash)
        const reportHash = ethers.keccak256(ethers.toUtf8Bytes(report));
        console.log(`📑 Empreinte Forensic (Hash) : ${reportHash}`);

        // 4. Configuration Connexion Blockchain (BASE)
        const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");

        // --- RÉCUPÉRATION DE LA CLÉ PRIVÉE ---
        if (!process.env.PRIVATE_KEY) {
            throw new Error("PRIVATE_KEY manquante dans le fichier .env");
        }

        // Nettoyage de sécurité (espaces et 0x)
        const rawKey = process.env.PRIVATE_KEY.trim();
        const formattedKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;

        const wallet = new ethers.Wallet(formattedKey, provider);
        // ---------------------------

        console.log(`👛 Signature via Wallet : ${wallet.address}`);
        console.log("⏳ Envoi de la preuve sur Base...");

        // 5. Envoi de la transaction
        const tx = await wallet.sendTransaction({
            to: wallet.address,
            value: 0,
            data: reportHash 
        });

        console.log(`\n🚀 AUDIT CERTIFIÉ SUR LA BLOCKCHAIN !`);
        console.log(`🔗 Hash Transaction : ${tx.hash}`);
        console.log(`🌍 Voir sur BaseScan : https://basescan.org/tx/${tx.hash}`);

        // 6. Mise à jour du rapport local
        const updatedReport = JSON.parse(report);
        updatedReport.blockchain_status = "CERTIFIED";
        updatedReport.transaction_id = tx.hash;
        fs.writeFileSync(reportPath, JSON.stringify(updatedReport, null, 2));

    } catch (error) {
        console.error("\n❌ ÉCHEC DE NOTARISATION :");
        console.error(error.message);
    }
}

notarizeAudit();