const fs = require('fs');
const path = require('path');

// 1. CONFIGURATION DES CHEMINS
const registryPath = path.join(__dirname, 'registry.json');
const templatePath = path.join(__dirname, 'template.html');
const outDir = path.join(__dirname, 'public');

// Créer le dossier /public s'il n'existe pas
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// 2. CHARGEMENT DES SOURCES
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

// 3. FORMULE OFFICIELLE AI IQ (COPIÉE DE TON JS FRONTEND)
function calculateAIIQ(entity) {
    let f = 60;
    const m = entity.financials?.market_cap?.value || 0;
    // Seuils originaux : 200 -> 98, 100 -> 85
    if (m >= 200) f = 98; 
    else if (m >= 100) f = 85; 
    else if (m >= 10) f = 75;

    const h = entity.cultural_intelligence?.brand_heat_index?.value || 70;
    
    let s = 0;
    if (entity["2a_id"]) s += 50;
    if (entity.entity?.ownership) s += 40;
    if (entity.governance) s += 10;

    const risks = entity.strategy?.risks || [];
    const rScore = Math.max(50, 90 - (risks.length * 8));

    return Math.round((f * 0.3) + (h * 0.3) + (s * 0.2) + (rScore * 0.2));
}

// 4. FONCTIONS DE RENDU HTML (POUR INJECTER LES TABLEAUX)
function buildFinancials(financials = {}) {
    return Object.entries(financials).map(([k, v]) =>
        `<div class="pb-2 border-b border-white/5 uppercase">
            <span class="opacity-40 text-[9px] font-bold italic">${k.replace(/_/g, ' ')}</span><br>
            <span class="text-2a-emerald font-black italic">${v.value || v.min || 'N/A'} ${v.currency || ''}</span>
        </div>`
    ).join('');
}

function buildRisks(risks = []) {
    if (risks.length === 0) return '<span class="opacity-40 italic">No major risks identified.</span>';
    return risks.map(r =>
        `<span class="px-3 py-3 bg-red-950/20 border border-red-500/20 text-red-200 font-bold uppercase italic">RISK: ${r.value}</span>`
    ).join('');
}

// 5. GÉNÉRATION DES RAPPORTS
console.log('🚀 2A Agency — Generating Forensic Reports...\n');

registry.forEach(entity => {
    const iq = calculateAIIQ(entity);
    const sid = entity["2a_id"] || '2A-PENDING';
    const name = entity.entity.name;
    const hash = entity.proof?.hash || 'PENDING_VERIFICATION';
    
    // Création du slug (ex: "Louis Vuitton" -> "louis-vuitton")
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    // Remplacement des placeholders dans le template
    const html = template
        .replace(/\[\[ENTITY_NAME\]\]/g, name)
        .replace(/\[\[SOR_ID\]\]/g, sid)
        .replace(/\[\[AI_IQ\]\]/g, iq)
        .replace(/\[\[HASH\]\]/g, hash)
        .replace(/\[\[FINANCIALS\]\]/g, buildFinancials(entity.financials))
        .replace(/\[\[RISKS\]\]/g, buildRisks(entity.strategy?.risks));

    // Écriture du fichier final
    fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
    console.log(`✅ ${slug}.html — IQ: ${iq} | ID: ${sid}`);
});

console.log('\n✨ Generation complete. Files are in /public');