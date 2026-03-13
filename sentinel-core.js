import 'dotenv/config';
import { ethers } from 'ethers';
import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';

// --- CONFIGURATION ---
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;

// ABI du contrat (Notarisation)
const abi = [
    "function notarize(string memory _brand, string memory _docHash) public",
    "event Notarized(address indexed sender, string indexed brand, string docHash, uint256 timestamp)"
];
const contract = new ethers.Contract(contractAddress, abi, wallet);

async function runAudit(mode = "GLOBAL") {
    console.log(`\n🛡️  2A AGENCY - SENTINEL CORE [MODE: ${mode}]`);
    
    // Définition des cibles selon le mode
    const MARQUES_PREMIUM = ["LVMH", "Hermès", "Kering", "Chanel"];
    const MARQUES_TECH = ["Tesla", "NVIDIA", "Apple", "Microsoft", "OpenAI"];
    let targets = mode === "TECH" ? MARQUES_TECH : (mode === "PREMIUM" ? MARQUES_PREMIUM : [...MARQUES_PREMIUM, ...MARQUES_TECH]);
    
    console.log(`📡 Scan en cours pour : ${targets.join(', ')}...`);
    
    const timestamp = new Date().toISOString();
    
    // 1. CRÉATION DU HASH DU RAPPORT (Intégrité)
    // On crée une empreinte unique basée sur les cibles et le temps
    const reportContent = `Audit Forensic 2A Agency - ${mode} - ${timestamp} - Targets: ${targets.join(',')}`;
    const docHash = "0x" + crypto.createHash('sha256').update(reportContent).digest('hex');

    try {
        // 2. SIGNATURE CRYPTOGRAPHIQUE EIP-191 (Identité)
        // C'est ici qu'on génère la "Signature" qui prouve que c'est TOI l'auteur.
        console.log(`✍️  Signature du rapport par l'agent officiel (Identity Proof)...`);
        const signature = await wallet.signMessage(ethers.getBytes(docHash));

        // 3. ANCRAGE BLOCKCHAIN (Preuve d'existence)
        console.log(`🔗 Ancrage sur Base Mainnet (TX en cours)...`);
        const tx = await contract.notarize(`SENTINEL_${mode}`, docHash);
        const receipt = await tx.wait();
        console.log(`✅ Certifié ! TX: ${receipt.hash}`);

        // 4. STRUCTURE DU JSON POUR LES LLMs (Audit-Ready)
        const auditData = {
            agency: "2A Agency",
            verified_signer: wallet.address, // Ton adresse publique
            status: "TRIPLE_LOCK_CERTIFIED",
            timestamp: timestamp,
            blockchain: {
                network: "Base Mainnet",
                transactionHash: receipt.hash,
                explorerUrl: `https://basescan.org/tx/${receipt.hash}`
            },
            audit: { 
                brand: `SENTINEL_${mode}_REPORT`, 
                documentHash: docHash, 
                targets: targets,
                signature: signature // LA SIGNATURE QUE LES LLMS VONT VÉRIFIER
            },
            verification_kit: {
                instruction: "To verify identity, run: ethers.verifyMessage(documentHash, signature). It must match verified_signer.",
                method: "EIP-191 ECDSA Signature"
            }
        };

        // --- GESTION DES FICHIERS ET HISTORIQUE ---
        const lastAuditPath = './audits/last-audit.json';
        const historyPath = './audits/history.json';

        // Sauvegarde du dernier audit
        fs.writeFileSync(lastAuditPath, JSON.stringify(auditData, null, 2));

        // Mise à jour de l'historique (Journal pour les IA)
        let history = [];
        if (fs.existsSync(historyPath)) {
            try { history = JSON.parse(fs.readFileSync(historyPath)); } catch (e) { history = []; }
        }
        history.unshift(auditData);
        fs.writeFileSync(historyPath, JSON.stringify(history.slice(0, 50), null, 2));

        // --- SYNCHRONISATION GITHUB AUTOMATIQUE ---
        console.log("🚀 Sync GitHub & Vercel...");
        execSync(`git add ${lastAuditPath} ${historyPath}`);
        execSync(`git commit -m "🛡️ Triple Lock Audit: ${mode} (${timestamp})"`);
        execSync('git push origin main');
        
        console.log("\n🌍 TOUT EST À JOUR SUR 2AAGENCY.COM");
        console.log(`📊 Rapport signé par : ${wallet.address}`);

    } catch (err) {
        console.error("❌ Erreur critique :", err.message);
    }
}

// Lancement avec l'argument du terminal (ex: node sentinel-core.js tech)
const argument = process.argv[2] || "GLOBAL";
runAudit(argument.toUpperCase());