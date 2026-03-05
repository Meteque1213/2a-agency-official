import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const auditHash = "6a80529985bb1f83b8af875c18788e9fd4336a4d425f34af910498f0e1254a70";
  const brandName = "LVMH-HERMES-MARCH-2026";

  // Configuration manuelle de la connexion
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  console.log("Connexion au protocole 2A via Base Sepolia...");
  console.log(`Notarisation du Hash pour ${brandName}...`);
  
  try {
    const tx = await protocol.issueCertificate(brandName, auditHash);
    console.log("Transaction envoyée ! Attente de confirmation...");
    
    const receipt = await tx.wait();

    console.log("----------------------------------------------");
    console.log("✅ AUDIT NOTARISÉ AVEC SUCCÈS !");
    console.log("Transaction Hash:", receipt.hash);
    console.log(`Lien Basescan: https://sepolia.basescan.org/tx/${receipt.hash}`);
    console.log("----------------------------------------------");
  } catch (error) {
    console.error("Erreur :", error.message);
  }
}

main().catch(console.error);