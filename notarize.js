import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // LA LISTE DES 100 MARQUES
  const longevityBrands = [
    { name: "Oura Ring", score: 96 }, { name: "Whoop", score: 94 },
    { name: "ZOI", score: 93 }, { name: "Therabody", score: 92 },
    { name: "Thorne", score: 89 }, { name: "Biogena", score: 88 },
    { name: "Clinique La Prairie", score: 88 }, { name: "Lanserhof", score: 87 },
    { name: "Headspace", score: 87 }, { name: "Calm", score: 86 },
    { name: "Ritual", score: 85 }, { name: "MNDGYM", score: 85 },
    { name: "Thrival", score: 84 }, { name: "ENERGYbits®", score: 83 },
    { name: "Viome", score: 82 }, { name: "Withings", score: 80 },
    { name: "Bloom Nutrition", score: 80 }, { name: "Levels Health", score: 79 },
    { name: "Eight Sleep", score: 78 }, { name: "Somnee", score: 78 },
    { name: "Ancient + Brave", score: 77 }, { name: "Peloton", score: 77 },
    { name: "ZOE", score: 76 }, { name: "Pendulum", score: 75 },
    { name: "LMNT", score: 75 }, { name: "Bía Smart Mask", score: 75 },
    { name: "Alo Yoga", score: 75 }, { name: "Timeline", score: 74 },
    { name: "Elysium Health", score: 74 }, { name: "Caudalie Wellness", score: 73 },
    { name: "Bioptron Hyperlight", score: 73 }, { name: "Forme", score: 72 },
    { name: "Aegis Formulas", score: 72 }, { name: "Fountain Life", score: 71 },
    { name: "Johnson & Johnson", score: 71 }, { name: "Plated", score: 70 },
    { name: "Nestlé Health Science", score: 70 }, { name: "HVMN", score: 70 },
    { name: "Infiniwell", score: 69 }, { name: "Abbott", score: 69 },
    { name: "Unilever Wellness", score: 68 }, { name: "Cure", score: 68 },
    { name: "Seed", score: 67 }, { name: "Moon Juice", score: 66 },
    { name: "Tally Health", score: 65 }, { name: "Aware", score: 63 },
    { name: "Wild Nutrition", score: 62 }, { name: "Lululemon Studio", score: 62 },
    { name: "Vivobase", score: 61 }, { name: "Hum Nutrition", score: 56 },
    { name: "Sakara Life", score: 54 }, { name: "WelleCo", score: 50 }
  ];

  console.log(`🚀 Notarisation Longevity sur Base...`);

  for (const brand of longevityBrands) {
    const brandLabel = `2A Agency Longevity Audit: ${brand.name} | Score AI IQ: ${brand.score}`;
    const auditHash = ethers.id(`${brand.name}-${brand.score}-V2-MARCH-2026`);

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