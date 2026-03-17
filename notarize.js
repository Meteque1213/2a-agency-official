import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  // Configuration du contrat et du réseau Base
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

 // --- TON NOUVEAU ROOT HASH SYNCHRONISÉ (802 NODES) ---
 const bcorpRootHash = "0x773b2335c635dc82f9e04b9dfde3ae927b7b069dc3785c7fb46a360d1276f9d7";

 // --- LABEL OFFICIEL MIS À JOUR ---
 const batchLabel = "2A Agency Global Registry 2026 | Milestone 800 - 802 Trust Nodes";

  console.log("--------------------------------------------------");
  console.log("🛡️  NOTARISATION MASSIVE : SYSTEM OF RECORD");
  console.log(`📊 Statut     : Déploiement Registre Complet`);
  console.log(`🔐 Root Hash  : ${bcorpRootHash}`);
  console.log(`📝 Label      : ${batchLabel}`);
  console.log("--------------------------------------------------");

  try {
    console.log("⏳ Envoi de la preuve sur Base (Mainnet)...");
    
    // Appel à la fonction du contrat
    const tx = await protocol.issueCertificate(batchLabel, bcorpRootHash);
    
    console.log("📡 Transaction envoyée, attente de confirmation...");
    const receipt = await tx.wait();
    
    console.log("\n✅ REGISTRE GLOBAL NOTARISÉ AVEC SUCCÈS !");
    console.log(`🔗 TxID : ${receipt.hash}`);
    console.log(`🌐 Voir sur BaseScan : https://basescan.org/tx/${receipt.hash}`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("\n❌ ERREUR DE NOTARISATION :");
    if (error.message.includes("insufficient funds")) {
      console.error("👉 Ton portefeuille n'a pas assez d'ETH sur Base pour payer le gas.");
    } else {
      console.error(error.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});