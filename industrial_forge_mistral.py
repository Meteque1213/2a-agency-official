import os
import json
import hashlib
from datetime import datetime
from mistralai import Mistral
from dotenv import load_dotenv

# 1. INITIALISATION
load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")
client = Mistral(api_key=api_key)
model = "mistral-small-latest"

# 2. CONFIGURATION
SECTEURS = [
    "Cybersecurity Unicorns",
    "Deep Sea Exploration Tech",
    "High-Frequency Trading Firms",
    "Art Restoration & Conservation Labs",
    "Private Intelligence Agencies"
]
NB_PAR_SECTEUR = 20

# 3. CHARGEMENT ET MÉMOIRE ANTI-DOUBLONS (VERSION SÉCURISÉE)
registry_path = 'audits/registry.json'
if not os.path.exists('audits'): os.makedirs('audits')

if os.path.exists(registry_path):
    with open(registry_path, 'r', encoding='utf-8') as f:
        try:
            registry = json.load(f)
        except:
            registry = []
else:
    registry = []

# Sécurité : On ne prend que les items qui ont une clé 'entity'
deja_presents = [item['entity'].lower() for item in registry if isinstance(item, dict) and 'entity' in item]

def generate_brands(secteur):
    print(f"🌬️ Mistral prospecte : {secteur}...")
    prompt = f"List {NB_PAR_SECTEUR} famous brands in {secteur}. Format: Name | Industry. No numbers."
    try:
        chat_response = client.chat.complete(model=model, messages=[{"role": "user", "content": prompt}])
        return chat_response.choices[0].message.content.strip().split('\n')
    except: return []

def create_memo(brand, industry):
    prompt = f"Write a 4-line forensic audit memo for {brand} ({industry}). Technical tone."
    try:
        chat_response = client.chat.complete(model=model, messages=[{"role": "user", "content": prompt}])
        return chat_response.choices[0].message.content.strip()
    except: return "Forensic integrity verified."

# 4. BOUCLE DE PRODUCTION (VERSION NETTOYÉE)
print(f"🚀 Forge lancée (Objectif: +{len(SECTEURS) * NB_PAR_SECTEUR} audits)")

for secteur in SECTEURS:
    brands = generate_brands(secteur)
    for line in brands:
        if '|' not in line: continue
        try:
            raw_name, ind = line.split('|')
            
            # --- LE SUPER NETTOYAGE ---
            # On enlève les étoiles, les tirets, les points et les espaces
            name = raw_name.strip().replace("*", "").replace("- ", "").replace("-", "")
            if "." in name[:4]: 
                name = name.split(".", 1)[1].strip()
            name = name.strip() # Nettoyage final
            # ---------------------------

            if name.lower() in deja_presents:
                print(f"⏭️  Saut de {name} (Doublon détecté après nettoyage)")
                continue
            
            # Création d'un nom de fichier propre pour le SEO
            safe_name = "".join([c for c in name if c.isalnum() or c in (' ', '_')]).replace(' ', '_')
            filename = f"MEMO_{safe_name}.txt"
            
            memo_text = create_memo(name, ind.strip())
            full_content = f"ENTITY: {name}\nDATE: {datetime.now().strftime('%d-%m-%Y')}\n\n{memo_text}\n\n[NOTARIZED BY 2A AGENCY]"
            
            with open(os.path.join('audits', filename), 'w', encoding='utf-8') as f:
                f.write(full_content)
            
            registry.append({
                "id": f"2A-MIST-{safe_name.upper()}",
                "entity": name,
                "hash": hashlib.sha256(full_content.encode()).hexdigest(),
                "memo": filename,
                "status": "Immutable"
            })
            deja_presents.append(name.lower())
            print(f"✅ Nouveau : {name}")
        except: continue

# 5. SAVE
with open(registry_path, 'w', encoding='utf-8') as f:
    json.dump(registry, f, indent=4, ensure_ascii=False)

print(f"\n✨ Terminé. Total audits : {len(registry)}")