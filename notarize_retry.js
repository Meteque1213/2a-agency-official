import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // LA LISTE DES ÉCHECS (Extraite de ton log précédent)
  const retryBrands = [
    { "name": "Stella McCartney (RTW)", "score": 89 },
    { "name": "Aimé Leon Dore", "score": 88 },
    { "name": "Palace", "score": 87 },
    { "name": "Skims", "score": 86 },
    { "name": "Arc'teryx (Veilance)", "score": 84 },
    { "name": "Reformation", "score": 84 },
    { "name": "Our Legacy", "score": 84 },
    { "name": "Isabel Marant", "score": 82 },
    { "name": "Ganni", "score": 82 },
    { "name": "Supreme", "score": 82 },
    { "name": "Toteme", "score": 81 },
    { "name": "Casablanca", "score": 81 },
    { "name": "Nanushka", "score": 81 },
    { "name": "Patou", "score": 80 },
    { "name": "A.P.C.", "score": 80 },
    { "name": "Salomon (S/LAB)", "score": 80 },
    { "name": "Arket", "score": 78 },
    { "name": "Massimo Dutti", "score": 78 },
    { "name": "Lululemon", "score": 78 },
    { "name": "Hoka One One", "score": 76 },
    { "name": "Satisfy Running", "score": 76 },
    { "name": "District Vision", "score": 75 },
    { "name": "New Balance (Made in)", "score": 74 },
    { "name": "Nike (Lab)", "score": 74 },
    { "name": "Rick Owens (DRKSHDW)", "score": 72 },
    { "name": "Carhartt WIP", "score": 72 },
    { "name": "C.P. Company", "score": 71 },
    { "name": "Daily Paper", "score": 71 },
    { "name": "Swarovski", "score": 71 },
    { "name": "Sporty & Rich", "score": 70 },
    { "name": "Pandora", "score": 68 },
    { "name": "Rouje", "score": 68 },
    { "name": "Filippa K", "score": 66 },
    { "name": "Theory", "score": 65 },
    { "name": "Dsquared2", "score": 65 },
    { "name": "Everlane", "score": 64 },
    { "name": "Eileen Fisher", "score": 64 },
    { "name": "Nisolo", "score": 63 },
    { "name": "Barbour", "score": 62 },
    { "name": "Hartford", "score": 56 },
    { "name": "Sandro", "score": 55 },
    { "name": "Bonpoint", "score": 51 },
    { "name": "Caramel", "score": 50 },
    { "name": "Misha & Puff", "score": 49 },
    { "name": "Liewood", "score": 44 }
  ];

  console.log(`🚀 RELANCE Notarisation (Retry Mode) sur Base...`);

  for (const brand of retryBrands) {
    const brandLabel = `2A Agency Apparel Audit: ${brand.name} | Score AI IQ: ${brand.score}`;
    const auditHash = ethers.id(`${brand.name}-${brand.score}-APPAREL-MARCH-2026`);

    try {
      console.log(`Envoi : ${brand.name}...`);
      
      // On force un rafraîchissement du nonce pour chaque transaction
      const currentNonce = await wallet.getNonce();
      
      const tx = await protocol.issueCertificate(brandLabel, auditHash, {
        nonce: currentNonce,
        gasLimit: 100000 // Sécurité pour éviter les échecs de gas
      });
      
      const receipt = await tx.wait();
      console.log(`✅ Succès ! TX: https://basescan.org/tx/${receipt.hash}`);
      
      // PAUSE DE 3 SECONDES pour laisser respirer le réseau
      await new Promise(r => setTimeout(r, 3000));

    } catch (error) {
      console.error(`❌ Erreur persistante pour ${brand.name}:`, error.message);
      if (error.message.includes("insufficient funds")) break;
    }
  }
  console.log("🎯 Mission terminée.");
}

main().catch(console.error);