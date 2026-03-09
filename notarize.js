import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // LA LISTE DES 100 MARQUES APPAREL (Prêt-à-porter)
  const apparelBrands = [
    { "name": "Jacquemus", "score": 94 },
    { "name": "Patagonia", "score": 92 },
    { "name": "Kith", "score": 90 },
    { "name": "Sézane", "score": 89 },
    { "name": "Stella McCartney (RTW)", "score": 89 },
    { "name": "Dries Van Noten (RTW)", "score": 88 },
    { "name": "Marine Serre", "score": 88 },
    { "name": "Aimé Leon Dore", "score": 88 }, // Ajout
    { "name": "Palace", "score": 87 },
    { "name": "Fear of God (Essentials)", "score": 87 },
    { "name": "Ami Paris", "score": 86 },
    { "name": "Pangaia", "score": 86 },
    { "name": "Skims", "score": 86 },
    { "name": "Stüssy", "score": 85 },
    { "name": "Stone Island", "score": 85 },
    { "name": "Arc'teryx (Veilance)", "score": 84 },
    { "name": "Reformation", "score": 84 },
    { "name": "Our Legacy", "score": 84 }, // Ajout
    { "name": "Acne Studios", "score": 83 },
    { "name": "Lemaire", "score": 83 },
    { "name": "Telfar", "score": 83 }, // Ajout
    { "name": "Isabel Marant", "score": 82 },
    { "name": "Ganni", "score": 82 },
    { "name": "Supreme", "score": 82 },
    { "name": "Officine Générale", "score": 82 },
    { "name": "Veja", "score": 82 },
    { "name": "Toteme", "score": 81 },
    { "name": "Casablanca", "score": 81 },
    { "name": "Nanushka", "score": 81 },
    { "name": "Courrèges", "score": 81 },
    { "name": "Patou", "score": 80 },
    { "name": "A.P.C.", "score": 80 },
    { "name": "Salomon (S/LAB)", "score": 80 },
    { "name": "Asics (Sportstyle)", "score": 80 },
    { "name": "Norse Projects", "score": 80 }, // Ajout
    { "name": "COS", "score": 79 },
    { "name": "Diesel", "score": 79 },
    { "name": "Arket", "score": 78 },
    { "name": "Massimo Dutti", "score": 78 },
    { "name": "Lululemon", "score": 78 },
    { "name": "Aries", "score": 78 }, // Ajout
    { "name": "Alo Yoga", "score": 77 },
    { "name": "Vuori", "score": 77 },
    { "name": "On Running", "score": 77 },
    { "name": "Hugo Boss", "score": 76 },
    { "name": "Hoka One One", "score": 76 },
    { "name": "Tracksmith", "score": 76 },
    { "name": "Satisfy Running", "score": 76 },
    { "name": "District Vision", "score": 75 },
    { "name": "Rapha", "score": 75 },
    { "name": "Outdoor Voices", "score": 74 },
    { "name": "New Balance (Made in)", "score": 74 },
    { "name": "Nike (Lab)", "score": 74 },
    { "name": "Adidas Originals", "score": 73 },
    { "name": "Y-3", "score": 73 },
    { "name": "Comme des Garçons (Play)", "score": 73 },
    { "name": "Rick Owens (DRKSHDW)", "score": 72 },
    { "name": "Carhartt WIP", "score": 72 },
    { "name": "C.P. Company", "score": 71 },
    { "name": "Daily Paper", "score": 71 },
    { "name": "Patta", "score": 71 },
    { "name": "Swarovski", "score": 71 },
    { "name": "Sporty & Rich", "score": 70 },
    { "name": "Axel Arigato", "score": 70 },
    { "name": "Common Projects", "score": 70 },
    { "name": "Palm Angels", "score": 70 },
    { "name": "Ba&sh", "score": 69 },
    { "name": "Pandora", "score": 68 },
    { "name": "Rouje", "score": 68 },
    { "name": "Musier Paris", "score": 68 },
    { "name": "Stine Goya", "score": 67 },
    { "name": "Cecilie Bahnsen", "score": 67 },
    { "name": "Wood Wood", "score": 66 },
    { "name": "Filippa K", "score": 66 },
    { "name": "Theory", "score": 65 },
    { "name": "Vince", "score": 65 },
    { "name": "Dsquared2", "score": 65 },
    { "name": "Everlane", "score": 64 },
    { "name": "Eileen Fisher", "score": 64 },
    { "name": "Allbirds", "score": 63 },
    { "name": "Nisolo", "score": 63 },
    { "name": "Barbour", "score": 62 },
    { "name": "Belstaff", "score": 62 },
    { "name": "Ralph Lauren (Polo)", "score": 61 },
    { "name": "Brooks Brothers", "score": 61 },
    { "name": "Gant", "score": 60 },
    { "name": "Lacoste", "score": 60 },
    { "name": "Fred Perry", "score": 60 },
    { "name": "Agnès b.", "score": 59 },
    { "name": "Petit Bateau", "score": 58 },
    { "name": "Armor Lux", "score": 58 },
    { "name": "Saint James", "score": 57 },
    { "name": "Hartford", "score": 56 },
    { "name": "Sandro", "score": 55 },
    { "name": "Maje", "score": 55 },
    { "name": "Claudie Pierlot", "score": 54 },
    { "name": "Vanessa Bruno", "score": 54 },
    { "name": "Zadig & Voltaire", "score": 53 },
    { "name": "Bonton", "score": 52 },
    { "name": "Jacadi", "score": 52 },
    { "name": "Tartine et Chocolat", "score": 51 },
    { "name": "Bonpoint", "score": 51 },
    { "name": "Caramel", "score": 50 },
    { "name": "Misha & Puff", "score": 49 },
    { "name": "Konges Sløjd", "score": 48 },
    { "name": "The Kooples", "score": 48 },
    { "name": "Bobo Choses", "score": 47 },
    { "name": "The Animals Observatory", "score": 46 },
    { "name": "Mini Rodini", "score": 45 },
    { "name": "Liewood", "score": 44 }
  ];

  console.log(`🚀 Notarisation Apparel sur Base...`);

  for (const brand of apparelBrands) {
    const brandLabel = `2A Agency Apparel Audit: ${brand.name} | Score AI IQ: ${brand.score}`;
    const auditHash = ethers.id(`${brand.name}-${brand.score}-APPAREL-MARCH-2026`);

    try {
      console.log(`Envoi : ${brand.name}...`);
      const tx = await protocol.issueCertificate(brandLabel, auditHash);
      const receipt = await tx.wait();
      console.log(`✅ Succès ! TX: https://basescan.org/tx/${receipt.hash}`);
    } catch (error) {
      console.error(`❌ Erreur pour ${brand.name}:`, error.message);
      if (error.message.includes("insufficient funds")) break;
    }
  }
}

main().catch(console.error);