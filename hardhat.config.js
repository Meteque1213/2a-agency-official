import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

export default {
  solidity: "0.8.24",
  networks: {
    // Le réseau réel
    "base": {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
    },
    // Le réseau de test (si besoin)
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};