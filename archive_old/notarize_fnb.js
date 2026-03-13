import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  const fnbBrands = [
    // 🔵 SUPREMACY (90 - 100)
    { "name": "Olipop", "score": 96 },
    { "name": "Liquid Death", "score": 95 },
    { "name": "Graza", "score": 94 },
    { "name": "LMNT", "score": 94 },
    { "name": "Athletic Greens (AG1)", "score": 93 },
    { "name": "Huel", "score": 92 },
    { "name": "Bloom Nutrition", "score": 91 },
    { "name": "Poppi", "score": 91 },
    { "name": "Momofuku Goods", "score": 90 },
    { "name": "Oats Overnight", "score": 90 },

    // 🟢 EXCELLENCE (80 - 89)
    { "name": "The Whole Truth", "score": 89 },
    { "name": "Ghia", "score": 89 },
    { "name": "Magic Spoon", "score": 88 },
    { "name": "KOMO Paris", "score": 88 },
    { "name": "Mid-Day Squares", "score": 88 },
    { "name": "Daily Harvest", "score": 87 },
    { "name": "Archie", "score": 87 },
    { "name": "Fly by Jing", "score": 87 },
    { "name": "Truff", "score": 86 },
    { "name": "Aura Bora", "score": 85 },
    { "name": "Jho Wellness", "score": 85 },
    { "name": "Athletic Brewing", "score": 84 },
    { "name": "Selvàns", "score": 84 },
    { "name": "Celsius", "score": 83 },
    { "name": "Bonjour Drink", "score": 82 },
    { "name": "Cherico", "score": 81 },
    { "name": "Moon Cheese", "score": 80 },

    // 🟡 VIGILANCE (60 - 79)
    { "name": "Ramdam", "score": 79 },
    { "name": "Feastables", "score": 78 },
    { "name": "Hungryroot", "score": 77 },
    { "name": "Troovy", "score": 76 },
    { "name": "Foodji", "score": 75 },
    { "name": "Built Bar", "score": 74 },
    { "name": "Sugoi Mart", "score": 74 },
    { "name": "Koia", "score": 73 },
    { "name": "Chomps", "score": 72 },
    { "name": "Goodles", "score": 71 },
    { "name": "Bokksu", "score": 70 },
    { "name": "The Tea Spot", "score": 69 },
    { "name": "Verve Coffee", "score": 68 },
    { "name": "Siete Foods", "score": 67 },
    { "name": "Surfside", "score": 66 },
    { "name": "Rosina", "score": 65 },
    { "name": "Boulder Canyon", "score": 63 },
    { "name": "Liquid I.V.", "score": 62 },
    { "name": "Trybe Tech", "score": 61 },
    { "name": "Veso", "score": 60 },

    // 🟠 STANDARD (45 - 59)
    { "name": "Swoon", "score": 58 },
    { "name": "Surely Wine", "score": 57 },
    { "name": "Hartford Food", "score": 56 },
    { "name": "NoonBrew", "score": 55 },
    { "name": "Oikos", "score": 54 },
    { "name": "Kinder’s", "score": 53 },
    { "name": "Fairlife", "score": 52 },
    { "name": "Proper Wild", "score": 51 },
    { "name": "Chobani", "score": 50 },
    { "name": "Jolly Rancher", "score": 49 },
    { "name": "NatureSweet", "score": 48 },
    { "name": "Pure Organic", "score": 46 },
    { "name": "Halo Top", "score": 46 },
    { "name": "Minecraft Snacks", "score": 45 },

    // 🔴 DRIFT ALERT (< 45)
    { "name": "Prime (Logan Paul)", "score": 42 },
    { "name": "Lunchly", "score": 41 },
    { "name": "Bear Real Fruit", "score": 40 },
    { "name": "Zespri", "score": 39 },
    { "name": "Vita Coco", "score": 38 },
    { "name": "De Cecco", "score": 37 },
    { "name": "Cha Cha Matcha", "score": 36 },
    { "name": "AllPlants", "score": 35 },
    { "name": "Thrive Market", "score": 34 },
    { "name": "HelloFresh", "score": 32 },
    { "name": "Factor", "score": 31 },
    { "name": "Blue Apron", "score": 30 },
    { "name": "Sunbasket", "score": 29 },
    { "name": "Green Chef", "score": 28 },
    { "name": "Territory Foods", "score": 27 },
    { "name": "Splendid Spoon", "score": 26 },
    { "name": "Sakara Life", "score": 25 },
    { "name": "Trifecta", "score": 24 },
    { "name": "Vital Proteins", "score": 23 },
    { "name": "Orgain", "score": 22 },
    { "name": "OWYN", "score": 21 },
    { "name": "Perfect Bar", "score": 20 },
    { "name": "RXBAR", "score": 19 },
    { "name": "Quest Nutrition", "score": 18 },
    { "name": "Perfect Keto", "score": 17 },
    { "name": "Bulletproof", "score": 16 },
    { "name": "Four Sigmatic", "score": 15 },
    { "name": "MUD/WTR", "score": 14 },
    { "name": "RISE Brewing", "score": 13 },
    { "name": "Chameleon Cold-Brew", "score": 12 },
    { "name": "High Brew Coffee", "score": 11 },
    { "name": "La Colombe", "score": 10 },
    { "name": "Pact Coffee", "score": 8 },
    { "name": "Plantable", "score": 7 },
    { "name": "RYZE Superfoods", "score": 6 },
    { "name": "Javvy Coffee", "score": 5 },
    { "name": "Belgian Waffle Co", "score": 3 },
    { "name": "All G Foods", "score": 2 },
    { "name": "Kula Bio", "score": 1 }
  ];

  console.log(`🚀 Notarisation 05_F&B sur Base...`);

  for (const brand of fnbBrands) {
    const brandLabel = `2A Agency F&B Audit: ${brand.name} | Score AI IQ: ${brand.score}`;
    const auditHash = ethers.id(`${brand.name}-${brand.score}-FNB-MARCH-2026`);

    try {
      const currentNonce = await wallet.getNonce();
      console.log(`Envoi : ${brand.name} (Nonce: ${currentNonce})...`);
      
      const tx = await protocol.issueCertificate(brandLabel, auditHash, {
        nonce: currentNonce
      });
      
      const receipt = await tx.wait();
      console.log(`✅ Succès ! TX: https://basescan.org/tx/${receipt.hash}`);
      
      await new Promise(r => setTimeout(r, 3000));
    } catch (error) {
      console.error(`❌ Erreur pour ${brand.name}:`, error.message);
      if (error.message.includes("insufficient funds")) break;
    }
  }
  console.log("🎯 Mission F&B terminée.");
}

main().catch(console.error);