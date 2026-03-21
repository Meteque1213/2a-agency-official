const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = './registry.json';
const BACKUP_PATH = './registry.backup.pre-migration.json';

// --- LE MOULE CANONIQUE 3.1 ---
const DEFAULT_STRUCTURE = {
  schema_version: "3.1",
  data_meta: {
    entity_type: "brand",
    tier: 3,
    confidence_score: 0,
    last_updated: null,
    fiscal_year: null,
    data_origin: "pending"
  },
  financials: {
    annual_revenue: {
      value: null,
      currency: null,
      unit: null,
      is_estimated: true,
      status: "pending"
    },
    market_cap: { 
      value: null, 
      status: "not_applicable",
      status_reason: "data_pending_initialization"
    }
  },
  entity: {
    name: "Unknown Entity",
    slug: null,
    category: "Uncategorized",
    ownership: { type: "independent", stake_percent: 100 },
    parent_group: null,
    subsidiaries: []
  },
  proof: { sources: [], disclaimer: null }
};

if (!fs.existsSync(REGISTRY_PATH)) {
    console.error("❌ Erreur : registry.json introuvable.");
    process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
let patchedCount = 0;

const migrated = registry.map((entry, i) => {
    // Si l'entrée est corrompue ou vide
    if (!entry || typeof entry !== 'object' || Object.keys(entry).length === 0) {
        patchedCount++;
        return { ...DEFAULT_STRUCTURE, "2a_id": `2A-TEMP-${String(i).padStart(4,'0')}` };
    }

    const name = entry.entity?.name || entry.entity || "Unknown";
    const needsPatch = !entry.data_meta || !entry.financials || !entry.proof || !entry.schema_version;

    if (needsPatch) patchedCount++;

    // --- MERGE PROFOND ---
    return {
        ...DEFAULT_STRUCTURE,
        ...entry,
        data_meta: { ...DEFAULT_STRUCTURE.data_meta, ...entry.data_meta },
        entity: { 
            ...DEFAULT_STRUCTURE.entity, 
            ...(typeof entry.entity === 'string' ? { name: entry.entity } : entry.entity) 
        },
        financials: {
            ...DEFAULT_STRUCTURE.financials,
            ...entry.financials,
            annual_revenue: {
                ...DEFAULT_STRUCTURE.financials.annual_revenue,
                ...entry.financials?.annual_revenue
            }
        },
        proof: { ...DEFAULT_STRUCTURE.proof, ...entry.proof }
    };
});

fs.writeFileSync(BACKUP_PATH, JSON.stringify(registry, null, 2));
fs.writeFileSync(REGISTRY_PATH, JSON.stringify(migrated, null, 2));

console.log(`\n✅ MIGRATION TERMINEE`);
console.log(`🔧 Entrées normalisées : ${patchedCount} / ${registry.length}`);
console.log(`🔒 Backup de sécurité créé : ${BACKUP_PATH}`);