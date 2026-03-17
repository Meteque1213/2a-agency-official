import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  // Configuration du contrat et du réseau Base
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // --- TON NOUVEAU ROOT HASH (JALON 1056) ---
  const registryRootHash = "0xfb120608bcafe0960e3bda9b88466299928f8ab9862046153abca1b4d3f42802";

  // --- LABEL OFFICIEL ---
  const notarizationMemo = "2A Agency | System of Record | 1056 Trust Nodes Certified | v1.0.0";

  console.log("--------------------------------------------------");
  console.log("🛡️  NOTARISATION MASSIVE : SYSTEM OF RECORD");
  console.log(`📊 Statut     : Déploiement Registre Complet`);
  console.log(`🔐 Root Hash  : ${registryRootHash}`);
  console.log(`📝 Label      : ${notarizationMemo}`);
  console.log("--------------------------------------------------");

  try {
    console.log("⏳ Envoi de la preuve sur Base (Mainnet)...");
    
    // Appel à la fonction du contrat avec les BONNES variables
    const tx = await protocol.issueCertificate(notarizationMemo, registryRootHash);
    
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