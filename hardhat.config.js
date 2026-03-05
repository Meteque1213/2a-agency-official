import "@nomicfoundation/hardhat-ethers"; // On ne charge QUE les ethers
import "dotenv/config";

export default {
  solidity: "0.8.24",
  networks: {
    "base-sepolia": {
      type: "http",
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};