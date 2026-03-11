import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  // Configuration du contrat et du réseau Base
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  // Interface du contrat (ABI)
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // --- ÉTAPE 1 : TON ROOT HASH ---
  // C'est l'empreinte de tes 100 marques calculée dans ton terminal
  const mobilityRootHash = "9b83914d9f1bc8ab832f367a13e0dddf0e19c8bd5ee9639a144bf6f81b8a05df";
  
  // --- ÉTAPE 2 : LE LABEL OFFICIEL ---
  // Ce texte apparaîtra sur la blockchain pour identifier l'audit
  const batchLabel = "2A Agency Mobility Index 2026 | Full Registry (100 Brands) | System of Record";

  console.log("--------------------------------------------------");
  console.log("🚀 INITIALISATION : Notarisation Globale Mobility");
  console.log(`📡 Réseau : Base L2`);
  console.log(`📄 Label : ${batchLabel}`);
  console.log(`🔐 Root Hash : ${mobilityRootHash}`);
  console.log("--------------------------------------------------");

  try {
    console.log("⏳ Envoi de la transaction sur Base... (Attente de confirmation)");
    
    // Appel de la fonction du contrat
    const tx = await protocol.issueCertificate(batchLabel, mobilityRootHash);
    
    // Attente du minage du bloc
    const receipt = await tx.wait();
    
    console.log("\n✅ NOTARISATION RÉUSSIE !");
    console.log("--------------------------------------------------");
    console.log(`🔗 Transaction ID (TxID) : ${receipt.hash}`);
    console.log(`🌐 Voir sur BaseScan : https://basescan.org/tx/${receipt.hash}`);
    console.log("--------------------------------------------------");
    console.log("\n💡 PROCHAINE ÉTAPE :");
    console.log(`Copie le TxID (${receipt.hash}) et colle-le dans le champ 'hash' de ton fichier database.js.`);

  } catch (error) {
    console.error("\n❌ ERREUR LORS DE LA NOTARISATION :");
    if (error.message.includes("insufficient funds")) {
      console.error("⛽ Erreur : Tu n'as pas assez d'ETH sur Base pour payer le gaz.");
    } else {
      console.error(error.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});