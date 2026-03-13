import hre from "hardhat";

async function main() {
  console.log("🚀 Déploiement du Notaire Sentinel sur Base...");

  // On force une compilation propre
  await hre.run('compile');

  const Notary = await hre.ethers.getContractFactory("SentinelNotary");
  const notary = await Notary.deploy();

  await notary.waitForDeployment();

  const address = await notary.getAddress();
  console.log("✅ Contrat déployé à l'adresse :", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});