import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // --- ROOT HASH BEAUTY (02) ---
  // Fingerprint unique pour la catégorie Cosmétiques & Soins
  const beautyRootHash = "0x744a08dd79a8664dda4fc9fddc55e7e9a682f70a7258198c1df23fa71c36f001";
  
  // --- LABEL OFFICIEL ---
  const batchLabel = "2A Agency Beauty Index 2026 | Global System of Record (50 Brands)";

  console.log("--------------------------------------------------");
  console.log("💄 NOTARISATION : SECTION 02 - BEAUTY");
  console.log(`🔐 Root Hash : ${beautyRootHash}`);
  console.log("--------------------------------------------------");

  try {
    console.log("⏳ Envoi de la preuve sur Base...");
    const tx = await protocol.issueCertificate(batchLabel, beautyRootHash);
    const receipt = await tx.wait();
    
    console.log("\n✅ SECTION 02 NOTARISÉE !");
    console.log(`🔗 TxID : ${receipt.hash}`);
    console.log(`🌐 https://basescan.org/tx/${receipt.hash}`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("\n❌ ERREUR :", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});