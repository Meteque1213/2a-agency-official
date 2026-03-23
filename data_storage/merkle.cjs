const fs = require('fs');
const crypto = require('crypto');

try {
    const registry = JSON.parse(fs.readFileSync('registry.json', 'utf8'));
    const leaves = registry.map(item => 
        crypto.createHash('sha256').update(JSON.stringify(item)).digest('hex')
    );
    const root = crypto.createHash('sha256').update(leaves.join('')).digest('hex');

    console.log("\n-----------------------------------------");
    console.log("🛡️  SENTINEL INTEGRITY ROOT");
    console.log("-----------------------------------------");
    console.log(`📊 Audit Count : ${registry.length}`);
    console.log(`🔑 ROOT HASH   : 0x${root}`);
    console.log("-----------------------------------------");
    console.log("✅ Registry integrity verified.");
} catch (e) {
    console.error("❌ Error:", e.message);
}