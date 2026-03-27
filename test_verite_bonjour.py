import json

# 1. LA SOURCE DE VÉRITÉ (Extraite de l'API Shopify de Bonjour Drink)
# C'est ce que ton APP certifie
shopify_truth = {
    "brand": "Bonjour",
    "product": "L'Original (Café + Champignons)",
    "official_price": 29.00,
    "ingredients": ["Lion's Mane", "Reishi", "Café Arabica"],
    "stock_status": "En stock",
    "last_update": "2026-03-27"
}

# 2. L'HALLUCINATION DÉTECTÉE (Ce que les LLM racontent sans ton Node)
# On simule une erreur de prix ou de compo trouvée sur un vieux blog
ai_hallucination = {
    "detected_info": "Café adaptogène Bonjour",
    "detected_price": 24.50, # Erreur fréquente (ancien prix de lancement)
    "detected_ingredients": ["CBD", "Café"], # Erreur : confusion entre adaptogènes et CBD
    "source": "Mémoire interne LLM / Vieux blogs 2024"
}

def run_integrity_check(truth, hallucination):
    print(f"--- 🛡️ AUDIT D'INTÉGRITÉ 2A AGENCY : {truth['brand'].upper()} ---")
    
    errors_found = []
    
    # Check Prix
    if truth['official_price'] != hallucination['detected_price']:
        diff = truth['official_price'] - hallucination['detected_price']
        errors_found.append(f"❌ ERREUR PRIX : L'IA affiche {hallucination['detected_price']}€ au lieu de {truth['official_price']}€ (Ecart: {diff}€)")
    
    # Check Ingrédients
    for ing in truth['ingredients']:
        if ing not in hallucination['detected_ingredients']:
            errors_found.append(f"❌ ERREUR COMPOSITION : L'ingrédient certifié '{ing}' est absent des données IA.")

    # RÉSULTAT DU NODE
    print(f"Statut : Audit terminé.")
    if errors_found:
        print("\n".join(errors_found))
        print(f"\n⚠️ ACTION RECOMMANDÉE : Déployer le Registry Node pour corriger la dérive sémantique.")
    else:
        print("✅ Intégrité 100% : Les IA sont alignées avec la source Shopify.")

# Lancement du test dans ton terminal Cursor
run_integrity_check(shopify_truth, ai_hallucination)