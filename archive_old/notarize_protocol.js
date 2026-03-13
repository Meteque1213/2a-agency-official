import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1";
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  // Le nom du protocole qui apparaîtra sur Basescan
  const protocolName = "SYSTEM_PROTOCOL_AI-IQ_V1";
  
  // Le contenu immuable du protocole
  const protocolContent = "2A Agency AI-IQ Protocol v1.0. Framework for Algorithmic Integrity & Brand Reputation. Built on Base L2, compliant with ERC-8004. Validator: 2A Agency. March 2026.";
  const protocolHash = ethers.id(protocolContent);

  console.log("📜 Notarisation du Protocole Racine en cours...");

  const tx = await protocol.issueCertificate(protocolName, protocolHash);
  const receipt = await tx.wait();

  console.log(`✅ PROTOCOLE ANCRÉ !`);
  console.log(`TX Hash: ${receipt.hash}`);
}

main().catch(console.error);