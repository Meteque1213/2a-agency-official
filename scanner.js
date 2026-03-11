import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';

const cryptoList = [
    {"id": "BTC", "name": "Bitcoin", "ai_iq": 99, "whitepaper_url": "https://bitcoin.org/bitcoin.pdf"},
    {"id": "ETH", "name": "Ethereum", "ai_iq": 98, "whitepaper_url": "https://ethereum.org/whitepaper.pdf"},
    {"id": "USDT", "name": "Tether", "ai_iq": 72, "whitepaper_url": "https://tether.to/whitepaper.pdf"},
    {"id": "BNB", "name": "BNB Chain", "ai_iq": 85, "whitepaper_url": "https://whitepaper.io/document/10/binance-coin-whitepaper"},
    {"id": "XRP", "name": "XRP", "ai_iq": 82, "whitepaper_url": "https://ripple.com/files/ripple_consensus_whitepaper.pdf"},
    {"id": "USDC", "name": "USDC", "ai_iq": 96, "whitepaper_url": "https://www.centre.io/hubfs/pdfs/centre-whitepaper.pdf"},
    {"id": "SOL", "name": "Solana", "ai_iq": 92, "whitepaper_url": "https://solana.com/solana-whitepaper.pdf"},
    {"id": "TRX", "name": "TRON", "ai_iq": 74, "whitepaper_url": "https://tron.network/static/doc/white_paper_v2_0.pdf"},
    {"id": "FIG", "name": "Figure Heloc", "ai_iq": 88, "whitepaper_url": "https://www.figure.com/blockchain/"},
    {"id": "DOGE", "name": "Dogecoin", "ai_iq": 45, "whitepaper_url": "https://foundation.dogecoin.com/manifesto/"},
    {"id": "WBT", "name": "WhiteBIT Coin", "ai_iq": 78, "whitepaper_url": "https://whitebit.com/wbt-whitepaper.pdf"},
    {"id": "USDS", "name": "USDS (Sky)", "ai_iq": 94, "whitepaper_url": "https://docs.sky.money/overview/white-paper"},
    {"id": "ADA", "name": "Cardano", "ai_iq": 91, "whitepaper_url": "https://docs.cardano.org/introduction/"},
    {"id": "BCH", "name": "Bitcoin Cash", "ai_iq": 84, "whitepaper_url": "https://www.bitcoincash.org/bitcoin.pdf"},
    {"id": "LEO", "name": "LEO Token", "ai_iq": 70, "whitepaper_url": "https://www.bitfinex.com/wp-content/uploads/2019/05/UNUS-SED-LEO-Whitepaper.pdf"},
    {"id": "HYPE", "name": "Hyperliquid", "ai_iq": 97, "whitepaper_url": "https://hyperliquid.xyz/papers/l1.pdf"},
    {"id": "XMR", "name": "Monero", "ai_iq": 95, "whitepaper_url": "https://www.getmonero.org/resources/research-lab/pubs/whitepaper.pdf"},
    {"id": "LINK", "name": "Chainlink", "ai_iq": 96, "whitepaper_url": "https://research.chain.link/whitepaper-v2.pdf"},
    {"id": "USDe", "name": "Ethena USDe", "ai_iq": 81, "whitepaper_url": "https://ethena-labs.gitbook.io/ethena-labs/"},
    {"id": "CC", "name": "Canton Network", "ai_iq": 89, "whitepaper_url": "https://www.canton.network/"},
    {"id": "XLM", "name": "Stellar", "ai_iq": 88, "whitepaper_url": "https://www.stellar.org/papers/stellar-consensus-protocol.pdf"},
    {"id": "USD1", "name": "USD1", "ai_iq": 92, "whitepaper_url": "https://usual.gitbook.io/usual-technical-documentation/"},
    {"id": "DAI", "name": "Dai", "ai_iq": 93, "whitepaper_url": "https://makerdao.com/en/whitepaper/"},
    {"id": "RAIN", "name": "Rain", "ai_iq": 79, "whitepaper_url": "https://docs.rain.fi/"},
    {"id": "LTC", "name": "Litecoin", "ai_iq": 89, "whitepaper_url": "https://litecoin.org/"},
    {"id": "AVAX", "name": "Avalanche", "ai_iq": 91, "whitepaper_url": "https://www.avalabs.org/whitepapers"},
    {"id": "PYUSD", "name": "PayPal USD", "ai_iq": 93, "whitepaper_url": "https://www.paypal.com/us/cshelp/article/what-is-paypal-usd-pyusd-help1005"},
    {"id": "HBAR", "name": "Hedera", "ai_iq": 90, "whitepaper_url": "https://hedera.com/hh_whitepaper.pdf"},
    {"id": "SUI", "name": "Sui", "ai_iq": 92, "whitepaper_url": "https://github.com/MystenLabs/sui/blob/main/doc/paper/sui.pdf"},
    {"id": "ZEC", "name": "Zcash", "ai_iq": 91, "whitepaper_url": "https://z.cash/wp-content/uploads/2021/11/protocol.pdf"},
    {"id": "SHIB", "name": "Shiba Inu", "ai_iq": 41, "whitepaper_url": "https://shibatoken.com/whitepaper"},
    {"id": "TON", "name": "Toncoin", "ai_iq": 86, "whitepaper_url": "https://docs.ton.org/foundations/whitepapers/overview"},
    {"id": "CRO", "name": "Cronos", "ai_iq": 82, "whitepaper_url": "https://cronos.org/whitepaper.pdf"},
    {"id": "XAUT", "name": "Tether Gold", "ai_iq": 87, "whitepaper_url": "https://gold.tether.to/Relevant-Information-Document.pdf"},
    {"id": "WLFI", "name": "World Liberty Fin.", "ai_iq": 76, "whitepaper_url": "https://worldlibertyfinancial.com"},
    {"id": "PAXG", "name": "PAX Gold", "ai_iq": 94, "whitepaper_url": "https://paxos.com/pax-gold-whitepaper/"},
    {"id": "DOT", "name": "Polkadot", "ai_iq": 89, "whitepaper_url": "https://github.com/polkadot-io/polkadot-white-paper/blob/master/PolkaDotPaper.pdf"},
    {"id": "M", "name": "MemeCore", "ai_iq": 62, "whitepaper_url": "https://docs.memecore.com/"},
    {"id": "UNI", "name": "Uniswap", "ai_iq": 97, "whitepaper_url": "https://uniswap.org/whitepaper-v3.pdf"},
    {"id": "MNT", "name": "Mantle", "ai_iq": 88, "whitepaper_url": "https://www.mantle.xyz/whitepaper"},
    {"id": "PI", "name": "Pi Network", "ai_iq": 38, "whitepaper_url": "https://minepi.com/white-paper/"},
    {"id": "USYC", "name": "Circle USYC", "ai_iq": 95, "whitepaper_url": "https://www.circle.com/en/usdc/institutional"},
    {"id": "OKB", "name": "OKB", "ai_iq": 79, "whitepaper_url": "https://www.okx.com/okb"},
    {"id": "BUIDL", "name": "BlackRock BUIDL", "ai_iq": 98, "whitepaper_url": "https://www.sec.gov/Archives/edgar/data/1986015/000119312524072841/d791535dnflow.htm"},
    {"id": "TAO", "name": "Bittensor", "ai_iq": 93, "whitepaper_url": "https://bittensor.com/whitepaper"},
    {"id": "FUSD", "name": "Falcon USD", "ai_iq": 84, "whitepaper_url": "https://www.falconx.io/"},
    {"id": "SKY", "name": "Sky (SKY)", "ai_iq": 87, "whitepaper_url": "https://docs.sky.money/"},
    {"id": "ASTER", "name": "Aster", "ai_iq": 81, "whitepaper_url": "https://docs.astar.network/"},
    {"id": "GUSD", "name": "Global Dollar", "ai_iq": 90, "whitepaper_url": "https://globaldollar.network/"},
    {"id": "AAVE", "name": "Aave", "ai_iq": 96, "whitepaper_url": "https://aave.com/docs/aave-v3/overview"},
    {"id": "NEAR", "name": "NEAR Protocol", "ai_iq": 91, "whitepaper_url": "https://pages.near.org/papers/the-official-near-white-paper/"},
    {"id": "RLUSD", "name": "Ripple USD", "ai_iq": 92, "whitepaper_url": "https://ripple.com/solutions/stablecoin/"},
    {"id": "BGB", "name": "Bitget Token", "ai_iq": 77, "whitepaper_url": "https://www.bitget.com/fr/events/bgb-whitepaper"},
    {"id": "HTX", "name": "HTX DAO", "ai_iq": 71, "status": "Governance Risk", "whitepaper_url": "https://www.htxdao.com/"},
    {"id": "ICP", "name": "Internet Comp", "ai_iq": 88, "whitepaper_url": "https://dfinity.org/whitepaper.pdf"},
    {"id": "PEPE", "name": "Pepe", "ai_iq": 35, "whitepaper_url": "https://pepe.vip/manifesto"},
    {"id": "BFUSD", "name": "BFUSD", "ai_iq": 83, "whitepaper_url": "https://www.binance.com/"},
    {"id": "USDY", "name": "Ondo USDY", "ai_iq": 91, "whitepaper_url": "https://ondo.finance/usdy"},
    {"id": "ETC", "name": "Ethereum Classic", "ai_iq": 82, "whitepaper_url": "https://ethereumclassic.org/knowledge/whitepaper"},
    {"id": "ONDO", "name": "Ondo", "ai_iq": 92, "whitepaper_url": "https://ondo.finance/whitepaper"},
    {"id": "PUMP", "name": "Pump.fun", "ai_iq": 32, "whitepaper_url": "https://pump.fun/terms"},
    {"id": "GT", "name": "Gate Token", "ai_iq": 76, "whitepaper_url": "https://www.gate.io/gate_token"},
    {"id": "MORPHO", "name": "Morpho", "ai_iq": 95, "whitepaper_url": "https://whitepaper.morpho.org/"},
    {"id": "USTB", "name": "Superstate USTB", "ai_iq": 97, "whitepaper_url": "https://www.superstate.co/ustb"},
    {"id": "KCS", "name": "KuCoin Token", "ai_iq": 72, "whitepaper_url": "https://www.kucoin.com/kcs"},
    {"id": "WLD", "name": "Worldcoin", "ai_iq": 84, "whitepaper_url": "https://whitepaper.worldcoin.org/"},
    {"id": "POL", "name": "Polygon (POL)", "ai_iq": 90, "whitepaper_url": "https://polygon.technology/papers/pol-whitepaper"},
    {"id": "EUTBL", "name": "Spiko EUTBL", "ai_iq": 94, "whitepaper_url": "https://www.spiko.xyz/"},
    {"id": "QNT", "name": "Quant", "ai_iq": 91, "whitepaper_url": "https://www.quant.network/overledger-white-paper"},
    {"id": "ATOM", "name": "Cosmos", "ai_iq": 89, "whitepaper_url": "https://v1.cosmos.network/resources/whitepaper"},
    {"id": "NEXO", "name": "Nexo", "ai_iq": 75, "whitepaper_url": "https://nexo.com/assets/downloads/nexo-whitepaper.pdf"},
    {"id": "NIGHT", "name": "Midnight", "ai_iq": 85, "whitepaper_url": "https://midnight.network/"},
    {"id": "ENA", "name": "Ethena (ENA)", "ai_iq": 80, "whitepaper_url": "https://ethena-labs.gitbook.io/ethena-labs/"},
    {"id": "USDtb", "name": "USDtb", "ai_iq": 88, "whitepaper_url": "https://ethena.fi/"},
    {"id": "KAS", "name": "Kaspa", "ai_iq": 87, "whitepaper_url": "https://kaspa.org/wp-content/uploads/2022/09/ghostdag-full-6.pdf"},
    {"id": "HASH", "name": "Provenance", "ai_iq": 93, "whitepaper_url": "https://provenance.io/whitepaper.pdf"},
    {"id": "RENDER", "name": "Render", "ai_iq": 92, "whitepaper_url": "https://renderfoundation.com/whitepaper"},
    {"id": "FLR", "name": "Flare", "ai_iq": 86, "whitepaper_url": "https://flare.network/wp-content/uploads/Flare-White-Paper.pdf"},
    {"id": "ALGO", "name": "Algorand", "ai_iq": 91, "whitepaper_url": "https://www.algorand.com/technology/white-papers"},
    {"id": "OUSG", "name": "OUSG (Ondo)", "ai_iq": 96, "whitepaper_url": "https://ondo.finance/ousg"},
    {"id": "USDD", "name": "USDD", "ai_iq": 68, "whitepaper_url": "https://usdd.io/USDD-Whitepaper.pdf"},
    {"id": "JH", "name": "Janus Henderson", "ai_iq": 98, "whitepaper_url": "https://www.janushenderson.com/"},
    {"id": "APT", "name": "Aptos", "ai_iq": 90, "whitepaper_url": "https://aptosfoundation.org/whitepaper"},
    {"id": "TRUMP", "name": "Official Trump", "ai_iq": 45, "whitepaper_url": "https://worldlibertyfinancial.com"},
    {"id": "FIL", "name": "Filecoin", "ai_iq": 88, "whitepaper_url": "https://filecoin.io/filecoin.pdf"},
    {"id": "XDC", "name": "XDC Network", "ai_iq": 87, "whitepaper_url": "https://xinfin.org/docs/whitepaper-tech.pdf"},
    {"id": "BDX", "name": "Beldex", "ai_iq": 82, "whitepaper_url": "https://beldex.io/whitepaper.pdf"},
    {"id": "VET", "name": "VeChain", "ai_iq": 89, "whitepaper_url": "https://www.vechain.org/whitepaper-2-0/"},
    {"id": "YLDS", "name": "YLDS", "ai_iq": 84, "whitepaper_url": "https://docs.yields.fi/"},
    {"id": "ARB", "name": "Arbitrum", "ai_iq": 92, "whitepaper_url": "https://developer.arbitrum.io/whitepaper.pdf"},
    {"id": "GHO", "name": "GHO (Aave)", "ai_iq": 94, "whitepaper_url": "https://docs.aave.com/faq/gho-stablecoin"},
    {"id": "JUP", "name": "Jupiter", "ai_iq": 87, "whitepaper_url": "https://docs.jup.ag/"},
    {"id": "STABLE", "name": "Stable", "ai_iq": 78, "whitepaper_url": "https://stable.com/"},
    {"id": "JHT", "name": "Janus Henderson Tr.", "ai_iq": 98, "whitepaper_url": "https://www.janushenderson.com/"},
    {"id": "USD0", "name": "Usual USD", "ai_iq": 89, "whitepaper_url": "https://usual.gitbook.io/"},
    {"id": "BONK", "name": "Bonk", "ai_iq": 30, "whitepaper_url": "https://www.bonkcoin.com/one-pager"},
    {"id": "DCR", "name": "Decred", "ai_iq": 85, "whitepaper_url": "https://decred.org/decred-whitepaper.pdf"},
    {"id": "TUSD", "name": "TrueUSD", "ai_iq": 65, "whitepaper_url": "https://www.trueusd.com/TrueUSD-Whitepaper.pdf"},
    {"id": "A7", "name": "A7", "ai_iq": 57, "whitepaper_url": "https://www.trmlabs.com/reports"},
    {"id": "KITE", "name": "Kite", "ai_iq": 68, "whitepaper_url": "https://kite.network/"}
];

async function getHashFromUrl(url) {
    if (!url || !url.startsWith('http')) return "INVALID_URL";
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const hash = crypto.createHash('sha256').update(response.data).digest('hex');
        return hash;
    } catch (error) {
        return "HASH_ERROR_LINK_DOWN";
    }
}

async function startScan() {
    console.log("-----------------------------------------");
    console.log("🚀 SENTINEL SCANNER: SHA-256 TOP 100 CRYPTO");
    console.log("-----------------------------------------");
    const results = [];
    for (const asset of cryptoList) {
        process.stdout.write(`Scanning ${asset.id.padEnd(6)} | ${asset.name.padEnd(20)} ... `);
        const hash = await getHashFromUrl(asset.whitepaper_url);
        results.push({ ...asset, whitepaper_hash: hash, scan_date: new Date().toISOString() });
        console.log(hash.startsWith("HASH") || hash === "INVALID_URL" ? "❌" : `✅ ${hash.substring(0, 10)}...`);
        await new Promise(r => setTimeout(r, 600)); // Pause anti-DDOS
    }
    fs.writeFileSync('crypto_with_hashes.json', JSON.stringify(results, null, 2));
    console.log("\n🎯 Scan terminé. Fichier : crypto_with_hashes.json");
}

startScan();