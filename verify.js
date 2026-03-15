/**
 * 2A AGENCY - CRYPTOGRAPHIC PROOF VERIFIER (L2 ANCHOR SYNC)
 * Version: 2.1.0 - Production Ready
 */

import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION DU CHEMIN (ESM) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION FINALE (Post-Déploiement) ---
const REGISTRY_FILE = 'registry.json';
const NEW_CONTRACT_ADDRESS = '0xCB7436FeB68D673c9252C312d5b4263000fcD616';
const EXPECTED_ROOT = '0x1b6427a3710e0bb41d48125a57408f284b74d95c674e41f43a28115b46b0cedc';

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
 * Combine deux hachages pour créer un nœud parent (Merkle Tree construction).
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
        console.log(`[1] Active Contract: ${NEW_CONTRACT_ADDRESS}`);
        console.log(`[2] Loading registry: ${REGISTRY_FILE}...`);
        
        const registryPath = path.join(__dirname, REGISTRY_FILE);
        const rawData = fs.readFileSync(registryPath, 'utf8');
        const data = JSON.parse(rawData);
        const entities = data.entities;
        
        if (!entities || !Array.isArray(entities)) {
            throw new Error("Format du registre invalide.");
        }
        
        console.log(`[3] Hashing ${entities.length} entities...`);
        
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
        console.log(`[LOCAL]  COMPUTED ROOT: ${finalRoot}`);
        console.log(`[CHAIN]  ANCHORED ROOT: ${EXPECTED_ROOT}`);
        console.log(`-----------------------------------------`);
        
        if (finalRoot === EXPECTED_ROOT) {
            console.log(`✅ MATCH SUCCESS: Integrity verified on Base L2.`);
            console.log(`Status: 2A Agency Registry is tamper-proof.`);
            process.exit(0);
        } else {
            console.error(`❌ MATCH FAILURE: Local data differs from Blockchain Anchor.`);
            process.exit(1);
        }
        
    } catch (error) {
        console.error(`❌ ERROR: ${error.message}`);
        process.exit(1);
    }
}

verifyRegistry();