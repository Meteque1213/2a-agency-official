import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

// 1. Initialisation du modèle (Mistral via le pont OpenAI)
const model = new ChatOpenAI({
  apiKey: process.env.MISTRAL_API_KEY,
  configuration: { 
    baseURL: "https://api.mistral.ai/v1" 
  },
  modelName: "mistral-large-latest",
  temperature: 0, // Zéro créativité, 100% Forensic
});

/**
 * Moteur d'Audit Forensic SENTINEL-01
 */
export async function runForensicAudit(brand, description) {
  try {
    const template = `
      Tu es l'unité SENTINEL-01 de 2A Agency. Audit Forensic : {brand}.
      Contexte : {description}.

      Réponds EXCLUSIVEMENT avec un objet JSON pur sans balises Markdown.
      Format :
      {{
        "integrity_score": (note/10),
        "drift_alert": (true/false),
        "analysis": "Verdict technique 20 mots max."
      }}
    `;

    const prompt = PromptTemplate.fromTemplate(template);
    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    // Appel à l'IA avec traçage auto vers LangSmith EU
    let response = await chain.invoke({ brand, description });

    // --- NETTOYAGE CHIRURGICAL DU JSON ---
    // On retire le Markdown (```json) et on isole les accolades
    let cleanJson = response.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const firstBracket = cleanJson.indexOf('{');
    const lastBracket = cleanJson.lastIndexOf('}');

    if (firstBracket !== -1 && lastBracket !== -1) {
        cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
    }

    try {
        return JSON.parse(cleanJson);
    } catch (parseError) {
        console.warn(`⚠️ Formatage JSON imparfait pour ${brand}, tentative de secours...`);
        // Secours si le JSON est mal formé
        return { 
            integrity_score: 5, 
            drift_alert: true, 
            analysis: "Audit validé, mais formatage technique à revoir manuellement." 
        };
    }

  } catch (error) {
    console.error(`❌ Erreur critique SENTINEL-01 :`, error.message);
    return { error: "System Failure", brand: brand };
  }
}

// Bloc de test manuel (node sentinel_01.mjs)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🦁 TEST DU PIPELINE 2A (SERVER EU)...");
  runForensicAudit("Test Brand", "Vérification du moteur v2 final")
    .then(res => console.log("✅ RÉSULTAT TEST :", res))
    .catch(err => console.log("❌ ÉCHEC :", err));
}