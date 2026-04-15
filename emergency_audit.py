cat << 'EOF' > emergency_audit.py
import asyncio
import sys
import os
from sentinel.sentinel import Sentinel

async def main():
    # CONFIGURATION FORCÉE
    NODES = "data/nodes"
    DB = "notary.db"
    BRAND_QUERY = "Loro Piana"

    print(f"--- DEBUG START ---")
    print(f"Looking into: {os.path.abspath(NODES)}")
    
    # On initialise avec les chemins qu'on VEUT
    s = Sentinel(NODES, DB)
    
    print(f"Brands loaded by class: {len(s.brands)}")
    
    # On cherche la marque
    targets = [b for b in s.brands if BRAND_QUERY.lower() in b.get("name", "").lower()]
    
    if not targets:
        print(f"❌ '{BRAND_QUERY}' non trouvé dans les {len(s.brands)} marques.")
        if s.brands:
            print(f"Exemple de marques chargées: {[b.get('name') for b in s.brands[:3]]}")
        return

    print(f"✅ Cible trouvée: {targets[0]['name']}. Lancement de l'audit...")
    # On lance l'audit LLM
    summary = await s.run_scan(targets)
    print(f"\n✨ RÉSULTAT: {summary['total_alerts']} alertes pour {BRAND_QUERY}")

if __name__ == "__main__":
    asyncio.run(main())
EOF

PYTHONPATH=. python3 emergency_audit.py