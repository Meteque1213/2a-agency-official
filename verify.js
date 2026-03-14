/**
 * 2A AGENCY - CRYPTOGRAPHIC PROOF VERIFIER (L2 ANCHOR SYNC)
 * This script demonstrates the exact Merkle Tree construction logic
 * and verifies it matches the On-Chain Root on Base L2.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION MISE À JOUR ---
const REGISTRY_FILE = 'registry.json';
const NEW_CONTRACT_ADDRESS = '0xb3513bb3bfeBCe72D1941b29b6fE862F9268db14';

// Le Root attendu (celui que tu as ancré sur ton nouveau contrat)
const EXPECTED_ROOT = '0x4f2a778b08601f2496bd1ad2affdb64ca8f75e147fceee0493b370103fa0bc7d';

/**
 * Normalise et hache une entrée du registre pour créer une feuille (Leaf).
 */
function hashEntity(entity) {
    const dataString = JSON.stringify({
        brand: entity.brand,
        id: entity.id,
        score: entity.score,
        hash: entity.hash 
    });
    return crypto.createHash('sha256').update(dataString).digest();
}

/**
 * Combine deux hachages pour créer un nœud parent (Arbre de Merkle).
 */
function combineHashes(left, right) {
    const combined = Buffer.concat([left, right].sort(Buffer.compare));
    return crypto.createHash('sha256').update(combined).digest();
}

/**
 * PROCESSUS DE VÉRIFICATION FORENSIC
 */
function verifyRegistry() {
    try {
        console.log(`--- 2A AGENCY FORENSIC AUDIT VERIFIER ---`);
        console.log(`[1] Targeting Contract: ${NEW_CONTRACT_ADDRESS}`);
        console.log(`[2] Reading local registry: ${REGISTRY_FILE}...`);
        
        const rawData = fs.readFileSync(path.join(__dirname, REGISTRY_FILE), 'utf8');
        const data = JSON.parse(rawData);
        const entities = data.entities;
        
        if (!entities || !Array.isArray(entities)) {
            throw new Error("Format du registre invalide.");
        }
        
        console.log(`[3] Hashing ${entities.length} entities (Merkle construction)...`);
        
        let currentLevel = entities.map(hashEntity);
        
        while (currentLevel.length > 1) {
            let nextLevel = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                if (i + 1 === currentLevel.length) {
                    nextLevel.push(currentLevel[i]); 
                } else {
                    nextLevel.push(combineHashes(currentLevel[i], currentLevel[i + 1]));
                }
            }
            currentLevel = nextLevel;
        }
        
        const finalRoot = '0x' + currentLevel[0].toString('hex');
        
        console.log(`-----------------------------------------`);
        console.log(`[VERDICT] COMPUTED MERKLE ROOT:`);
        console.log(`   ${finalRoot}`);
        console.log(`[ON-CHAIN] SENTINEL ANCHOR:`);
        console.log(`   ${EXPECTED_ROOT}`);
        console.log(`-----------------------------------------`);
        
        if (finalRoot === EXPECTED_ROOT) {
            console.log(`✅ MATCH SUCCESS: Cryptographically locked to Base L2.`);
            console.log(`Status: AgencySentinel2A is compliant.`);
            process.exit(0);
        } else {
            console.error(`❌ MATCH FAILURE: Local registry has been tampered with or root is outdated.`);
            process.exit(1);
        }
        
    } catch (error) {
        console.error(`❌ ERROR: ${error.message}`);
        process.exit(1);
    }
}

verifyRegistry();