/**
 * 2A AGENCY - CRYPTOGRAPHIC PROOF VERIFIER
 * This script demonstrates the exact Merkle Tree construction logic
 * that maps the 1,000 registry entities to the On-Chain Root.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 1. Target Registry & Expected Root
const REGISTRY_FILE = 'registry.json';
const EXPECTED_ROOT = '0x4f2a778b08601f2496bd1ad2affdb64ca8f75e147fceee0493b370103fa0bc7d';

/**
 * Normalizes and hashes an individual audit entry to a Merkle Leaf.
 */
function hashEntity(entity) {
    // Normalization ensures deterministic output
    const dataString = JSON.stringify({
        brand: entity.brand,
        id: entity.id,
        score: entity.score,
        hash: entity.hash // The individual audit forensic hash
    });
    
    // Convert string to buffer for SHA-256
    return crypto.createHash('sha256').update(dataString).digest();
}

/**
 * Combines two hashes to create a parent node in the Merkle Tree.
 */
function combineHashes(left, right) {
    // Standard Merkle tree parent hash: sha256(min(a,b) + max(a,b))
    const combined = Buffer.concat([left, right].sort(Buffer.compare));
    return crypto.createHash('sha256').update(combined).digest();
}

/**
 * MAIN VERIFICATION PROCESS
 */
function verifyRegistry() {
    try {
        console.log(`--- 2A AGENCY FORENSIC AUDIT VERIFIER ---`);
        console.log(`[1] Reading registry: ${REGISTRY_FILE}...`);
        
        const rawData = fs.readFileSync(path.join(__dirname, REGISTRY_FILE), 'utf8');
        const data = JSON.parse(rawData);
        const entities = data.entities;
        
        if (!entities || !Array.isArray(entities)) {
            throw new Error("Invalid registry format: 'entities' array not found.");
        }
        
        console.log(`[2] Normalizing & Hashing ${entities.length} entities...`);
        
        // Step 1: Compute Leaf Hashes
        let currentLevel = entities.map(hashEntity);
        
        console.log(`[3] Constructing Merkle Tree...`);
        
        // Step 2: Build Tree Layer by Layer
        let levelCount = 0;
        while (currentLevel.length > 1) {
            let nextLevel = [];
            levelCount++;
            
            for (let i = 0; i < currentLevel.length; i += 2) {
                // Handle odd number of leaves: duplicate the last hash
                if (i + 1 === currentLevel.length) {
                    nextLevel.push(currentLevel[i]); 
                } else {
                    nextLevel.push(combineHashes(currentLevel[i], currentLevel[i + 1]));
                }
            }
            currentLevel = nextLevel;
        }
        
        // Step 3: Extract Final Root
        const finalRoot = '0x' + currentLevel[0].toString('hex');
        
        console.log(`-----------------------------------------`);
        console.log(`[VERDICT] COMPUTED MERKLE ROOT:`);
        console.log(`   ${finalRoot}`);
        console.log(`[CLAIMED] ON-CHAIN ROOT:`);
        console.log(`   ${EXPECTED_ROOT}`);
        console.log(`-----------------------------------------`);
        
        if (finalRoot === EXPECTED_ROOT) {
            console.log(`✅ MATCH SUCCESS: The off-chain registry is cryptographically locked to the on-chain anchor.`);
            process.exit(0);
        } else {
            console.error(`❌ MATCH FAILURE: The registry does not match the on-chain root.`);
            process.exit(1);
        }
        
    } catch (error) {
        console.error(`❌ ERROR: ${error.message}`);
        process.exit(1);
    }
}

// Start the verification
verifyRegistry();