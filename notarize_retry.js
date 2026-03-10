import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // LES 4 DERNIERS RÉSISTANTS
  const final4 = [
    { name: "Bía Smart Mask", score: 75 },
    { name: "Elysium Health", score: 74 },
    { name: "Pendulum", score: 61 },
    { name: "Wild Nutrition", score: 58 }
  ];

  console.log(`🎯 ULTIME PASSAGE : Notarisation des 4 dernières marques Longevity...`);

  for (const brand of final4) {
    const brandLabel = `2A Agency Longevity Audit: ${brand.name} | Score AI IQ: ${brand.score}`;
    const auditHash = ethers.id(`${brand.name}-${brand.score}-LONGEVITY-MARCH-2026`);

    try {
      // On récupère le nonce "latest" pour être ultra-précis
      const currentNonce = await provider.getTransactionCount(wallet.address, "latest");
      
      console.log(`Envoi : ${brand.name} (Nonce: ${currentNonce})...`);
      
      const tx = await protocol.issueCertificate(brandLabel, auditHash, {
        nonce: currentNonce,
        gasLimit: 150000 
      });
      
      const receipt = await tx.wait();
      console.log(`✅ SUCCÈS TOTAL pour ${brand.name} ! TX: https://basescan.org/tx/${receipt.hash}`);
      
      // PAUSE DE SÉCURITÉ DE 5 SECONDES
      console.log("Attente de 5s pour synchronisation réseau...");
      await new Promise(r => setTimeout(r, 5000));

    } catch (error) {
      console.error(`❌ Erreur pour ${brand.name}:`, error.shortMessage || error.message);
    }
  }
  console.log("🏁 TOUT EST FINI. Les 50 marques Longevity sont sur la Blockchain.");
}

main().catch(console.error);