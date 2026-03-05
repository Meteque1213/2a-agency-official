import asyncio
import json
import hashlib
import os
import re
from datetime import datetime
from dotenv import load_dotenv
import aiohttp

# 1. CHARGEMENT DE LA CONFIGURATION
load_dotenv()
PPLX_API_KEY = os.getenv("PERPLEXITY_API_KEY")
PPLX_URL = "https://api.perplexity.ai/chat/completions"

async def query_perplexity(brand, point):
    """Interroge Perplexity pour vérifier une donnée de luxe en temps réel."""
    prompt = f"What is the official current {point} for the luxury brand {brand}? Provide a short, precise answer."
    
    headers = {
        "Authorization": f"Bearer {PPLX_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "sonar-pro",
        "messages": [
            {"role": "system", "content": "You are a luxury industry expert. Be concise and factual."},
            {"role": "user", "content": prompt}
        ]
    }

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(PPLX_URL, json=payload, headers=headers) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    content = data['choices'][0]['message']['content'].strip()
                    return {point: content}
                else:
                    error_detail = await resp.text()
                    print(f"\n[!] Erreur API {resp.status} : {error_detail}")
                    return None
        except Exception as e:
            print(f"\n[!] Erreur de connexion : {e}")
            return None

async def run_audit():
    """Lance l'audit complet pour LVMH et Hermès."""
    if not os.path.exists('ground_truth.json'):
        print("Erreur : Le fichier ground_truth.json est introuvable !")
        return

    with open('ground_truth.json', 'r') as f:
        truth = json.load(f)
    
    results = {}
    print(f"\n--- 2A AGENCY SENTINEL SCAN (PERPLEXITY ENGINE) ---")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)

    for brand in truth:
        print(f"\nScanning {brand}...")
        errors = 0
        details = {}

        for pt, real_val in truth[brand].items():
            print(f"  > Verifying {pt}...", end=" ", flush=True)
            
            ai_data = await query_perplexity(brand, pt)
            
            if ai_data:
                found_val = ai_data.get(pt, "N/A")
                
                # --- LOGIQUE DE MATCH INTELLIGENTE ---
                # 1. Match textuel simple (insensible à la casse)
                simple_match = str(real_val).lower() in found_val.lower()
                
                # 2. Match numérique (pour les prix comme 13500)
                clean_found = re.sub(r'[^\d]', '', found_val)
                clean_truth = re.sub(r'[^\d]', '', str(real_val))
                numeric_match = (clean_truth in clean_found and len(clean_truth) > 0)
                
                is_match = simple_match or numeric_match
                # -------------------------------------

                details[pt] = {
                    "found": found_val,
                    "truth": real_val,
                    "status": "OK" if is_match else "DRIFT"
                }
                
                if is_match:
                    print("✅ [OK]")
                else:
                    errors += 1
                    print(f"❌ [DRIFT]")
            else:
                errors += 1
                print("⚠️ [API ERROR]")

        score = int(100 - (errors / len(truth[brand]) * 100))
        results[brand] = {"score_2a": score, "details": details}
        print(f"SCORE FINAL {brand} : {score}/100")

    output = {
        "audit_id": hashlib.md5(datetime.now().isoformat().encode()).hexdigest()[:10],
        "timestamp": datetime.now().isoformat(),
        "results": results
    }
    
    with open('score_2a.json', 'w') as f:
        json.dump(output, f, indent=4)
    
    final_hash = hashlib.sha256(json.dumps(output).encode()).hexdigest()
    
    print("\n" + "="*50)
    print(f"RAPPORT GÉNÉRÉ : score_2a.json")
    print(f"HASH BLOCKCHAIN (À NOTARISER) :")
    print(f"{final_hash}")
    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(run_audit())