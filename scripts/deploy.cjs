import hre from "hardhat";

async function main() {
  console.log("🚀 Déploiement du Notaire Sentinel sur Base...");

  // On récupère le contrat
  const Notary = await hre.ethers.getContractFactory("SentinelNotary");
  
  // On lance le déploiement
  const notary = await Notary.deploy();

  // On attend la confirmation
  await notary.waitForDeployment();

  const address = await notary.getAddress();
  console.log("✅ Contrat déployé à l'adresse :", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});