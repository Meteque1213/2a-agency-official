import json
import os

INPUT_FILE = "resultats_2A_bruts.json"
OUTPUT_FILE = "audit_final_scores.csv"

def calculate_agent_score(brand_data):
    """Calcule le score AI-IQ Agents basé sur les données brutes."""
    score = 0
    signals = brand_data.get("data", "")
    
    # 1. ACCESSIBILITÉ (Max 40 pts)
    if "RateLimitTriggeredError" in signals or "429" in signals:
        score += 5  # Pénalité quasi-totale si bloqué
    elif "Max challenge attempts exceeded" in signals:
        score += 10 # Pénalité forte (Captcha/Cloudflare)
    else:
        score += 40 # Accès libre pour les agents
        
    # 2. STRUCTURE & RICHESSE (Max 30 pts)
    if "Markdown Content" in signals:
        score += 15
        # Si on détecte des structures de listes ou de liens propres
        if signals.count("* [") > 5:
            score += 15
            
    # 3. SIGNALS MÉTIER (Max 30 pts)
    # On cherche des mots-clés qui prouvent la richesse sémantique pour l'IA
    keywords = ["Luxury", "Portfolio", "Collection", "Global", "Services", "Models", "Contact"]
    matches = sum(1 for word in keywords if word.lower() in signals.lower())
    score += min(matches * 5, 30)
    
    return score

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Erreur : {INPUT_FILE} introuvable.")
        return

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"\n--- 📊 2A AGENCY : CALCUL DES SCORES AI-IQ AGENTS ---")
    
    results = []
    for brand in data:
        name = brand.get("marque", "Inconnue")
        score = calculate_agent_score(brand)
        
        # Définition du Statut
        if score >= 80: status = "🟢 Agent-Ready"
        elif score >= 40: status = "🟡 Partial Access"
        else: status = "🔴 Legacy Blocked"
        
        results.append({
            "Marque": name,
            "AI-IQ Agents": score,
            "Status": status
        })
        print(f"🎯 {name.ljust(30)} : {score}/100 ({status})")

    # Sauvegarde en CSV pour réimportation dans Notion
    import csv
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=["Marque", "AI-IQ Agents", "Status"])
        writer.writeheader()
        writer.writerows(results)

    print(f"\n🏆 Scoring terminé. Fichier généré : {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
