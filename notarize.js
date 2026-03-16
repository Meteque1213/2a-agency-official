import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  // Configuration du contrat et du réseau Base
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // --- TON NOUVEAU ROOT HASH (Pour 405 marques) ---
  const bcorpRootHash = "0x1de343c0e0f9b212b40c0c493f6774c61224f37946c785734b24e55714433de0";
  
  // --- LABEL OFFICIEL MIS À JOUR ---
  const batchLabel = "2A Agency B-Corp Index 2026 | Comprehensive Audit (405 Brands)";

  console.log("--------------------------------------------------");
  console.log("🛡️  NOTARISATION MASSIVE : B-CORP INDEX");
  console.log(`📊 Volume     : 405 Marques`);
  console.log(`🔐 Root Hash  : ${bcorpRootHash}`);
  console.log(`📝 Label      : ${batchLabel}`);
  console.log("--------------------------------------------------");

  try {
    console.log("⏳ Envoi de la preuve sur Base (Mainnet)...");
    
    // Appel à la fonction du contrat
    const tx = await protocol.issueCertificate(batchLabel, bcorpRootHash);
    
    console.log("📡 Transaction envoyée, attente de confirmation...");
    const receipt = await tx.wait();
    
    console.log("\n✅ INDEX DE 405 MARQUES NOTARISÉ !");
    console.log(`🔗 TxID : ${receipt.hash}`);
    console.log(`🌐 Voir sur BaseScan : https://basescan.org/tx/${receipt.hash}`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("\n❌ ERREUR DE NOTARISATION :");
    if (error.message.includes("insufficient funds")) {
      console.error("👉 Ton portefeuille n'a pas assez d'ETH sur Base pour le gas.");
    } else {
      console.error(error.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});