import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  const homeBrands = [
    { name: "Hermès Maison", score: 98 }, { name: "Baccarat", score: 97 },
    { name: "Dyson Home", score: 96 }, { name: "Burrow", score: 85 },
    { name: "Roche Bobois", score: 95 }, { name: "Ligne Roset", score: 94 },
    { name: "Cassina", score: 94 }, { name: "Kartell", score: 93 },
    { name: "Vitra", score: 93 }, { name: "Bang & Olufsen", score: 92 },
    { name: "Louis Vuitton Art de Vivre", score: 92 }, { name: "Fritz Hansen", score: 91 },
    { name: "Knoll", score: 91 }, { name: "Artek", score: 90 },
    { name: "Made.com", score: 48 }, { name: "Alessi", score: 90 },
    { name: "Moooi", score: 89 }, { name: "Hay", score: 89 },
    { name: "Muuto", score: 88 }, { name: "Article", score: 82 },
    { name: "Samsung Bespoke", score: 88 }, { name: "Miele", score: 87 },
    { name: "Smeg", score: 87 }, { name: "Flos", score: 86 },
    { name: "Artemide", score: 86 }, { name: "Farrow & Ball", score: 85 },
    { name: "GUBI", score: 85 }, { name: "Interior Define", score: 79 },
    { name: "Menu", score: 84 }, { name: "Bolia", score: 84 },
    { name: "BoConcept", score: 83 }, { name: "Ferm Living", score: 83 },
    { name: "Skagerak", score: 82 }, { name: "String Furniture", score: 82 },
    { name: "Carl Hansen & Søn", score: 81 }, { name: "PP Møbler", score: 81 },
    { name: "&Tradition", score: 80 }, { name: "Normann Copenhagen", score: 80 },
    { name: "Zanotta", score: 79 }, { name: "Magis", score: 79 },
    { name: "B&B Italia", score: 78 }, { name: "Molteni&C", score: 78 },
    { name: "Poltrona Frau", score: 77 }, { name: "Flexform", score: 77 },
    { name: "West Elm", score: 60 }, { name: "Minotti", score: 76 },
    { name: "Gervasoni", score: 76 }, { name: "Paola Lenti", score: 75 },
    { name: "Living Divani", score: 75 }, { name: "Edra", score: 74 },
    { name: "Moroso", score: 74 }, { name: "Riva 1920", score: 73 },
    { name: "Porro", score: 73 }, { name: "Rimadesio", score: 72 },
    { name: "Poliform", score: 72 }, { name: "Giorgetti", score: 71 },
    { name: "Boffi", score: 70 }, { name: "Bulthaup", score: 70 },
    { name: "Valcucine", score: 69 }, { name: "Dada", score: 69 },
    { name: "Gaggenau", score: 68 }, { name: "Sub-Zero Wolf", score: 68 },
    { name: "La Cornue", score: 67 }, { name: "Aga", score: 67 },
    { name: "Quooker", score: 66 }, { name: "Waterworks", score: 66 },
    { name: "Kohler", score: 65 }, { name: "Toto", score: 65 },
    { name: "Duravit", score: 64 }, { name: "Hansgrohe", score: 64 },
    { name: "Vola", score: 63 }, { name: "Dornbracht", score: 63 },
    { name: "Laufen", score: 62 }, { name: "Agape", score: 62 },
    { name: "Salvatori", score: 61 }, { name: "Mutina", score: 61 },
    { name: "Bisazza", score: 60 }, { name: "Marazzi", score: 60 },
    { name: "Florim", score: 59 }, { name: "Casalgrande Padana", score: 59 },
    { name: "Iris Ceramica", score: 58 }, { name: "Lea Ceramiche", score: 58 },
    { name: "Cotto d’Este", score: 57 }, { name: "Atlas Concorde", score: 57 },
    { name: "Appiani", score: 56 }, { name: "Sicis", score: 56 },
    { name: "Trend Group", score: 55 }, { name: "Lithos Design", score: 55 },
    { name: "Budri", score: 54 }, { name: "Margraf", score: 54 },
    { name: "Antolini", score: 53 }, { name: "Dekton (Cosentino)", score: 53 },
    { name: "Silestone", score: 52 }, { name: "Corian (DuPont)", score: 52 },
    { name: "Himacs", score: 51 }, { name: "Krion (Porcelanosa)", score: 51 },
    { name: "Zara Home", score: 64 }, { name: "IKEA", score: 62 },
    { name: "H&M Home", score: 58 }, { name: "CB2", score: 58 }
  ];

  console.log(`🏠 Lancement de la notarisation HOME (100 marques)...`);

  for (const brand of homeBrands) {
    const brandLabel = `2A Agency Home Audit: ${brand.name} | Score AI IQ: ${brand.score}`;
    const auditHash = ethers.id(`${brand.name}-${brand.score}-HOME-MARCH-2026`);

    try {
      const currentNonce = await provider.getTransactionCount(wallet.address, "pending");
      console.log(`Envoi : ${brand.name} (Nonce: ${currentNonce})...`);
      
      const tx = await protocol.issueCertificate(brandLabel, auditHash, {
        nonce: currentNonce,
        gasLimit: 150000 
      });
      
      const receipt = await tx.wait();
      console.log(`✅ Succès ! TX: https://basescan.org/tx/${receipt.hash}`);
      
      await new Promise(r => setTimeout(r, 5000)); // Pause de sécurité
    } catch (error) {
      console.error(`❌ Erreur pour ${brand.name}:`, error.message);
      if (error.message.includes("insufficient funds")) break;
    }
  }
}

main().catch(console.error);