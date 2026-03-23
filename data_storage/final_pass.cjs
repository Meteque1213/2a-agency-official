const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const CONTRACT_ADDRESS = "0x8269781b855d2987e9873ff1a3a81878e77665b1";
const ABI = ["function issueCertificate(string memory label, bytes32 auditHash) public returns (bytes32)"];
const protocol = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

const lastBrands = [
    { name: "Typology", score: 90 }, // Le rescapé du tour précédent
    { name: "Ex Nihilo", score: 89 }, { name: "Westman Atelier", score: 88 },
    { name: "Bond No.9", score: 88 }, { name: "ghd", score: 85 },
    { name: "Clarins", score: 84 }, { name: "Huda Beauty", score: 84 },
    { name: "Saie Beauty", score: 84 }, { name: "Laneige", score: 82 },
    { name: "Violette_FR", score: 82 }, { name: "Saint Jane", score: 82 },
    { name: "Rudolph Care", score: 81 }, { name: "Crown Affair", score: 81 },
    { name: "Caudalie", score: 80 }, { name: "Aesop", score: 79 },
    { name: "Anomalia Paris", score: 79 }, { name: "Nussa Cosmetics", score: 79 },
    { name: "Garnier", score: 78 }, { name: "Beauty of Joseon", score: 78 },
    { name: "Herbivore", score: 78 }, { name: "CeraVe", score: 77 },
    { name: "Avant Skincare", score: 76 }, { name: "Delilah Cosmetics", score: 76 },
    { name: "Summer Fridays", score: 76 }, { name: "Drunk Elephant", score: 75 },
    { name: "Medicube", score: 74 }, { name: "Azalia World", score: 74 },
    { name: "Avene", score: 73 }, { name: "YSL Beauty", score: 72 },
    { name: "Kerastase", score: 70 }, { name: "Mario Badescu", score: 70 },
    { name: "Essence Cosmetics", score: 63 }, { name: "Tower28", score: 62 },
    { name: "Florence by Mills", score: 59 }, { name: "R.E.M. Beauty", score: 58 },
    { name: "Milk Makeup", score: 52 }, { name: "Sol de Janeiro", score: 49 },
    { name: "TirTir", score: 48 }
];

async function main() {
    console.log(`🦁 2A Agency - ULTIMATE RUN : Notarisation des ${lastBrands.length} marques...`);
    for (const brand of lastBrands) {
        try {
            const label = `Forensic Audit 2A Agency: ${brand.name} | Score: ${brand.score}`;
            const auditHash = ethers.id(`${brand.name}-${brand.score}-MARCH-2026`);
            console.log(`Envoi : ${brand.name}...`);
            const tx = await protocol.issueCertificate(label, auditHash);
            console.log(`⏳ Attente Bloc...`);
            await tx.wait(); 
            console.log(`✅ Succès ! https://basescan.org/tx/${tx.hash}`);
            await new Promise(r => setTimeout(r, 3000)); // 3s pour être 100% sûr
        } catch (e) {
            console.log(`❌ Erreur pour ${brand.name}: ${e.message}`);
            if (e.message.includes("insufficient funds")) break;
        }
    }
    console.log("🏆 CHAMPION ! Ton audit Beauty 100 est complet sur la blockchain Base.");
}
main();