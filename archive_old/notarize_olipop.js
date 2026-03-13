import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // --- MODIFICATIONS POUR OLIPOP ---
  const memoID = "DNVB-2026-OLIPOP-004 (Olipop Supremacy)";
  // On utilise ton hash généré hier soir avec le 0x devant
  const memoHash = "0xa92bc582b1f13ef13a52c74fdde3d4b61a52cbd55963eb5fb2c38c271fbeebd8"; 

  console.log(`📡 Envoi du scellé Forensic (OLIPOP) au réseau Base...`);

  try {
    const tx = await protocol.issueCertificate(memoID, memoHash);
    const receipt = await tx.wait();
    console.log(`✅ AUDIT OLIPOP SCELLÉ ET IMMUABLE !`);
    console.log(`🔗 Transaction Proof: https://basescan.org/tx/${receipt.hash}`);
    console.log(`📁 Fichier lié: MEMO_DNVB_004_OLIPOP.txt`);
  } catch (error) {
    console.error(`❌ Erreur de scellé :`, error.message);
  }
}

main().catch(console.error);