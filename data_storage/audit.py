import asyncio
import aiohttp
import csv
import json
import os
from datetime import datetime

# CONFIGURATION
WORKER_URL = "https://royal-sea-50ea.alexandre-afc.workers.dev/?url="
INPUT_FILE = "urls.csv"
OUTPUT_FILE = "resultats_2A_bruts.json"

async def scan_brand(session, marque, url):
    """Scanne une marque via l'Oracle Cloudflare."""
    if not url or not url.startswith('http'):
        return None
    
    target_api = f"{WORKER_URL}{url.strip()}"
    print(f"📡 Analyse : {marque[:20]}...", end="\r")
    
    try:
        async with session.get(target_api, timeout=30) as resp:
            content = await resp.text()
            if resp.status == 200:
                print(f"✅ {marque}")
                return {"marque": marque, "url": url, "data": content, "timestamp": datetime.now().isoformat()}
            else:
                print(f"⚠️ {marque} (Erreur {resp.status})")
                return None
    except Exception:
        print(f"❌ {marque} (Échec)")
        return None

async def main():
    print(f"\n--- 🛰️ 2A AGENCY : DÉMARRAGE ---")
    
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Erreur : {INPUT_FILE} introuvable.")
        return

    brands_to_scan = []
    with open(INPUT_FILE, newline='', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        # Nettoyage des noms de colonnes
        reader.fieldnames = [f.strip() for f in reader.fieldnames]
        
        for row in reader:
            name = row.get("Marque") or row.get("name")
            # On teste toutes les colonnes d'URL possibles
            url = row.get("URL") or row.get("URL Officielle") or row.get("Proof URL")
            
            if name and url and url.strip().startswith('http'):
                brands_to_scan.append((name.strip(), url.strip()))

    if not brands_to_scan:
        print("❌ Aucune marque avec une URL valide n'a été trouvée dans le CSV.")
        return

    print(f"📦 {len(brands_to_scan)} marques détectées.\n")

    async with aiohttp.ClientSession() as session:
        semaphore = asyncio.Semaphore(5)
        async def sem_task(m, u):
            async with semaphore:
                return await scan_brand(session, m, u)

        tasks = [sem_task(m, u) for m, u in brands_to_scan]
        results = await asyncio.gather(*tasks)

    final_data = [r for r in results if r is not None]
    with open(OUTPUT_FILE, "w", encoding='utf-8') as f:
        json.dump(final_data, f, indent=4, ensure_ascii=False)

    print(f"\n🏆 TERMINÉ : {len(final_data)} fiches créées dans {OUTPUT_FILE}\n")

if __name__ == "__main__":
    asyncio.run(main())