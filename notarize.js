import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // LA LISTE DES 100 MARQUES
  const beautyBrands = [
    { name: "La Roche-Posay", score: 98 }, { name: "Dior Beauty", score: 97 },
    { name: "Chanel Beauty", score: 96 }, { name: "Augustinus Bader", score: 95 },
    { name: "Fenty Beauty", score: 94 }, { name: "Lyma Life", score: 93 },
    { name: "Biologique Recherche", score: 93 }, { name: "Rare Beauty", score: 92 },
    { name: "Dr. Barbara Sturm", score: 92 }, { name: "The Ordinary", score: 91 },
    { name: "Creed", score: 91 }, { name: "Rationale", score: 91 },
    { name: "Sephora", score: 90 }, { name: "Typology", score: 90 },
    { name: "Pat McGrath Labs", score: 89 }, { name: "Estée Lauder", score: 89 },
    { name: "Ex Nihilo", score: 89 }, { name: "Westman Atelier", score: 88 },
    { name: "Charlotte Tilbury", score: 88 }, { name: "Sulwhasoo", score: 88 },
    { name: "Bond No.9", score: 88 }, { name: "Lancôme", score: 87 },
    { name: "Parfums de Marly", score: 87 }, { name: "Clinique", score: 86 },
    { name: "The Whoo", score: 86 }, { name: "ELEMIS", score: 86 },
    { name: "L’Oréal Paris", score: 85 }, { name: "ghd", score: 85 },
    { name: "Jo Malone", score: 85 }, { name: "Ilia Beauty", score: 85 },
    { name: "Clarins", score: 84 }, { name: "Huda Beauty", score: 84 },
    { name: "Saie Beauty", score: 84 }, { name: "Shiseido", score: 83 },
    { name: "Lisa Eldridge Beauty", score: 83 }, { name: "Verdilab", score: 83 },
    { name: "Comfort Zone", score: 83 }, { name: "NARS", score: 82 },
    { name: "Laneige", score: 82 }, { name: "Violette_FR", score: 82 },
    { name: "Saint Jane", score: 82 }, { name: "Farmacy", score: 82 },
    { name: "Kiehl's", score: 81 }, { name: "Manucurist", score: 81 },
    { name: "Rudolph Care", score: 81 }, { name: "Crown Affair", score: 81 },
    { name: "Sunday Riley", score: 81 }, { name: "Caudalie", score: 80 },
    { name: "OPI", score: 80 }, { name: "Abel Odor", score: 80 },
    { name: "Skin Diligent", score: 80 }, { name: "French Farmacie", score: 80 },
    { name: "Aēsop", score: 79 }, { name: "Anomalia Paris", score: 79 },
    { name: "Care Natural Beauty", score: 79 }, { name: "Nüssa Cosmetics", score: 79 },
    { name: "Garnier", score: 78 }, { name: "Beauty of Joseon", score: 78 },
    { name: "ANTHÉSTÉ", score: 78 }, { name: "Eadem", score: 78 },
    { name: "Herbivore", score: 78 }, { name: "CeraVe", score: 77 },
    { name: "Botanic Pretti5", score: 77 }, { name: "Molecular Botanics", score: 77 },
    { name: "Haus Labs", score: 76 }, { name: "Avant Skincare", score: 76 },
    { name: "Delilah Cosmetics", score: 76 }, { name: "Summer Fridays", score: 76 },
    { name: "Drunk Elephant", score: 75 }, { name: "By Corel", score: 75 },
    { name: "MEV Skincare", score: 75 }, { name: "Vichy", score: 74 },
    { name: "Medicube", score: 74 }, { name: "Azalia World", score: 74 },
    { name: "CurrentBody", score: 74 }, { name: "Glow Recipe", score: 74 },
    { name: "Avène", score: 73 }, { name: "YSL Beauty", score: 72 },
    { name: "Darling", score: 72 }, { name: "RAS Beauty", score: 72 },
    { name: "Armani Beauty", score: 71 }, { name: "Mixa", score: 71 },
    { name: "Kérastase", score: 70 }, { name: "Mario Badescu", score: 70 },
    { name: "Benefit Cosmetics", score: 69 }, { name: "Glossier", score: 68 },
    { name: "Paula's Choice", score: 67 }, { name: "Tatcha", score: 66 },
    { name: "Maybelline NY", score: 65 }, { name: "NYX Cosmetics", score: 64 },
    { name: "Essence Cosmetics", score: 63 }, { name: "Tower28", score: 62 },
    { name: "Florence by Mills", score: 59 }, { name: "R.E.M. Beauty", score: 58 },
    { name: "Refy Beauty", score: 55 }, { name: "Milk Makeup", score: 52 },
    { name: "Sol de Janeiro", score: 49 }, { name: "TirTir", score: 48 },
    { name: "Kylie Cosmetics", score: 45 }, { name: "Rhode", score: 42 }
  ];

  console.log(`🚀 Connexion Mainnet. Notarisation de ${beautyBrands.length} marques...`);

  for (const brand of beautyBrands) {
    // On formate le nom comme pour Hermes
    const brandLabel = `Forensic Audit 2A Agency: ${brand.name} | Score: ${brand.score}`;
    // On génère un Hash unique pour le rapport
    const auditHash = ethers.id(`${brand.name}-${brand.score}-MARCH-2026`);

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