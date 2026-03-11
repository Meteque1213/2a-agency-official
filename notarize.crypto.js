import { ethers } from "ethers";
import "dotenv/config";

async function main() {
  const contractAddress = "0x8269781b855d2987e9873ff1a3a81878e77665b1"; 
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = ["function issueCertificate(string brandName, string reportHash) public"];
  const protocol = new ethers.Contract(contractAddress, abi, wallet);

  const cryptoAssets = [
    { "name": "Bitcoin (BTC)", "score": 99 },
    { "name": "Ethereum (ETH)", "score": 98 },
    { "name": "Tether (USDT)", "score": 72 },
    { "name": "BNB Chain (BNB)", "score": 85 },
    { "name": "XRP (XRP)", "score": 82 },
    { "name": "USDC (USDC)", "score": 96 },
    { "name": "Solana (SOL)", "score": 92 },
    { "name": "TRON (TRX)", "score": 74 },
    { "name": "Figure Heloc", "score": 88 },
    { "name": "Dogecoin (DOGE)", "score": 45 },
    { "name": "WhiteBIT Coin", "score": 78 },
    { "name": "USDS (USDS)", "score": 94 },
    { "name": "Cardano (ADA)", "score": 91 },
    { "name": "Bitcoin Cash (BCH)", "score": 84 },
    { "name": "LEO Token", "score": 70 },
    { "name": "Hyperliquid (HYPE)", "score": 97 },
    { "name": "Monero (XMR)", "score": 95 },
    { "name": "Chainlink (LINK)", "score": 96 },
    { "name": "Ethena USDe", "score": 81 },
    { "name": "Canton (CC)", "score": 89 },
    { "name": "Stellar (XLM)", "score": 88 },
    { "name": "USD1", "score": 92 },
    { "name": "Dai (DAI)", "score": 93 },
    { "name": "Rain (RAIN)", "score": 79 },
    { "name": "Litecoin (LTC)", "score": 89 },
    { "name": "Avalanche (AVAX)", "score": 91 },
    { "name": "PayPal USD (PYUSD)", "score": 93 },
    { "name": "Hedera (HBAR)", "score": 90 },
    { "name": "Sui (SUI)", "score": 92 },
    { "name": "Zcash (ZEC)", "score": 91 },
    { "name": "Shiba Inu (SHIB)", "score": 41 },
    { "name": "Toncoin (TON)", "score": 86 },
    { "name": "Cronos (CRO)", "score": 82 },
    { "name": "Tether Gold (XAUT)", "score": 87 },
    { "name": "World Liberty Fin.", "score": 76 },
    { "name": "PAX Gold (PAXG)", "score": 94 },
    { "name": "Polkadot (DOT)", "score": 89 },
    { "name": "MemeCore (M)", "score": 62 },
    { "name": "Uniswap (UNI)", "score": 97 },
    { "name": "Mantle (MNT)", "score": 88 },
    { "name": "Pi Network (PI)", "score": 38 },
    { "name": "Circle USYC", "score": 95 },
    { "name": "OKB (OKB)", "score": 79 },
    { "name": "BlackRock BUIDL", "score": 98 },
    { "name": "Bittensor (TAO)", "score": 93 },
    { "name": "Falcon USD", "score": 84 },
    { "name": "Sky (SKY)", "score": 87 },
    { "name": "Aster (ASTER)", "score": 81 },
    { "name": "Global Dollar", "score": 90 },
    { "name": "Aave (AAVE)", "score": 96 },
    { "name": "NEAR Protocol", "score": 91 },
    { "name": "Ripple USD", "score": 92 },
    { "name": "Bitget Token", "score": 77 },
    { "name": "HTX DAO", "score": 71 },
    { "name": "Internet Comp (ICP)", "score": 88 },
    { "name": "Pepe (PEPE)", "score": 35 },
    { "name": "BFUSD", "score": 83 },
    { "name": "Ondo USDY", "score": 91 },
    { "name": "Ethereum Classic", "score": 82 },
    { "name": "Ondo (ONDO)", "score": 92 },
    { "name": "Pump.fun (PUMP)", "score": 32 },
    { "name": "Gate (GT)", "score": 76 },
    { "name": "Morpho", "score": 95 },
    { "name": "Superstate USTB", "score": 97 },
    { "name": "KuCoin (KCS)", "score": 72 },
    { "name": "Worldcoin (WLD)", "score": 84 },
    { "name": "POL (ex-MATIC)", "score": 90 },
    { "name": "Spiko EUTBL", "score": 94 },
    { "name": "Quant (QNT)", "score": 91 },
    { "name": "Cosmos (ATOM)", "score": 89 },
    { "name": "NEXO (NEXO)", "score": 75 },
    { "name": "Midnight (NIGHT)", "score": 85 },
    { "name": "Ethena (ENA)", "score": 80 },
    { "name": "USDtb", "score": 88 },
    { "name": "Kaspa (KAS)", "score": 87 },
    { "name": "Provenance (HASH)", "score": 93 },
    { "name": "Render (RENDER)", "score": 92 },
    { "name": "Flare (FLR)", "score": 86 },
    { "name": "Algorand (ALGO)", "score": 91 },
    { "name": "OUSG (Ondo)", "score": 96 },
    { "name": "USDD", "score": 68 },
    { "name": "Janus Henderson", "score": 98 },
    { "name": "Aptos (APT)", "score": 90 },
    { "name": "Official Trump", "score": 45 },
    { "name": "Filecoin (FIL)", "score": 88 },
    { "name": "XDC Network", "score": 87 },
    { "name": "Beldex (BDX)", "score": 82 },
    { "name": "VeChain (VET)", "score": 89 },
    { "name": "YLDS", "score": 84 },
    { "name": "Arbitrum (ARB)", "score": 92 },
    { "name": "GHO (Aave)", "score": 94 },
    { "name": "Jupiter (JUP)", "score": 87 },
    { "name": "Stable (STABLE)", "score": 78 },
    { "name": "Janus Henderson Tr.", "score": 98 },
    { "name": "Usual USD (USD0)", "score": 89 },
    { "name": "Bonk (BONK)", "score": 30 },
    { "name": "Decred (DCR)", "score": 85 },
    { "name": "TrueUSD (TUSD)", "score": 65 },
    { "name": "A7A5", "score": 74 },
    { "name": "Kite (KITE)", "score": 68 }
  ];

  console.log(`🚀 Notarisation 07_Crypto sur Base...`);

  for (const asset of cryptoAssets) {
    const label = `2A Agency Crypto Index: ${asset.name} | Score AI IQ: ${asset.score}`;
    const auditHash = ethers.id(`${asset.name}-${asset.score}-CRYPTO-SENTINEL-MARCH-2026`);

    try {
      const currentNonce = await wallet.getNonce();
      console.log(`Ancrage : ${asset.name} (Score: ${asset.score})...`);
      
      const tx = await protocol.issueCertificate(label, auditHash, {
        nonce: currentNonce
      });
      
      const receipt = await tx.wait();
      console.log(`✅ Succès ! TX: https://basescan.org/tx/${receipt.hash}`);
      
      // Pause de 2 secondes pour éviter les problèmes de rate limit RPC
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`❌ Erreur pour ${asset.name}:`, error.message);
      if (error.message.includes("insufficient funds")) break;
    }
  }
  console.log("🎯 Index Crypto intégralement notarisé.");
}

main().catch(console.error);