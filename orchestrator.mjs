import fs from 'fs';
import * as cheerio from 'cheerio';
import { runForensicAudit } from './sentinel_01.mjs';

async function startGlobalAudit() {
    console.log("🦁 [2A AGENCY] Extraction des marques depuis registry.html...");

    try {
        // 1. Extraction (On garde ta méthode qui marche !)
        const html = fs.readFileSync('./registry.html', 'utf8');
        const luxuryMatch = html.match(/const luxuryData = (\[[\s\S]*?\]);/);
        const beautyMatch = html.match(/const beautyData = (\[[\s\S]*?\]);/);

        if (!luxuryMatch || !beautyMatch) {
            throw new Error("Impossible de trouver les données dans registry.html");
        }

        const allBrands = [...JSON.parse(luxuryMatch[1]), ...JSON.parse(beautyMatch[1])];
        console.log(`📊 [SUCCESS] ${allBrands.length} marques détectées.`);

        let globalReport = {
            agency: "2A Agency",
            engine: "Sentinel-01 (LangChain Edition)",
            timestamp: new Date().toISOString(),
            results: []
        };

        // 2. Boucle d'Audit via le nouveau moteur
        for (let i = 0; i < allBrands.length; i++) {
            const brand = allBrands[i];
            console.log(`🔎 [${i + 1}/${allBrands.length}] Audit Forensic : ${brand.name}...`);
            
            // L'IA envoie maintenant la trace sur LangSmith pendant cet appel
            const verdict = await runForensicAudit(brand.name, `Score actuel: ${brand.score}/100`);
            
            globalReport.results.push({
                brand: brand.name,
                previous_score: brand.score,
                verdict: verdict,
                notarization_hash: brand.hash
            });

            // On ralentit un peu (500ms) pour que LangSmith affiche les traces proprement
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 3. Sauvegarde
        fs.writeFileSync('./global_audit_report_v2.json', JSON.stringify(globalReport, null, 2));
        
        console.log("\n✅ AUDIT GLOBAL V2 TERMINÉ !");
        console.log(`📊 Regarde ton dashboard LangSmith pour voir les 198 traces.`);

    } catch (error) {
        console.error("\n❌ ERREUR :");
        console.error(error.message);
    }
}

startGlobalAudit();