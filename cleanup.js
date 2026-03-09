import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  const missingBrands = [
    { name: "Whoop", score: 94 }, { name: "ZOI", score: 93 },
    { name: "Therabody", score: 92 }, { name: "Ritual", score: 85 },
    { name: "MNDGYM", score: 85 }, { name: "Thrival", score: 84 },
    { name: "Withings", score: 80 }, { name: "Levels Health", score: 79 },
    { name: "Eight Sleep", score: 78 }, { name: "Somnee", score: 78 },
    { name: "ZOE", score: 76 }, { name: "Bía Smart Mask", score: 75 },
    { name: "Alo Yoga", score: 75 }, { name: "Timeline", score: 74 },
    { name: "Bioptron Hyperlight", score: 73 }, { name: "Forme", score: 72 },
    { name: "HVMN", score: 70 }, { name: "Infiniwell", score: 69 },
    { name: "Abbott", score: 69 }, { name: "Cure", score: 68 },
    { name: "Seed", score: 67 }, { name: "Vivobase", score: 61 },
    { name: "Hum Nutrition", score: 56 }
  ];

  console.log(`🧹 Nettoyage : Notarisation des ${missingBrands.length} marques restantes...`);
  
  // On récupère le nonce actuel du wallet
  let currentNonce = await provider.getTransactionCount(wallet.address);

  for (const brand of missingBrands) {
    const brandLabel = `2A Agency Longevity Audit: ${brand.name} | Score AI IQ: ${brand.score}`;
    const auditHash = ethers.id(`${brand.name}-${brand.score}-V2-MARCH-2026`);

    try {
      console.log(`Envoi : ${brand.name} (Nonce: ${currentNonce})...`);
      
      const tx = await protocol.issueCertificate(brandLabel, auditHash, {
        nonce: currentNonce
      });
      
      await tx.wait();
      console.log(`✅ Succès : ${brand.name} | TX: https://basescan.org/tx/${tx.hash}`);
      
      currentNonce++; // On incrémente manuellement pour la suivante
      await new Promise(r => setTimeout(r, 3000)); // Pause de 3s

    } catch (error) {
      console.error(`❌ Erreur ${brand.name}:`, error.message);
      // Si erreur de nonce, on rafraîchit le nonce pour la prochaine boucle
      currentNonce = await provider.getTransactionCount(wallet.address);
    }
  }
}

main().catch(console.error);