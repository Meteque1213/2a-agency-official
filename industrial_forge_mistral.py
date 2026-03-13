import os
import json
import hashlib
from datetime import datetime
from mistralai import Mistral
from dotenv import load_dotenv

# 1. SETUP
load_dotenv()
client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
model = "mistral-small-latest"

# 2. CONFIGURATION
SECTEURS = ["Luxury Watchmaking", "Private Aviation", "Cybersecurity", "Venture Capital"]
NB_PAR_SECTEUR = 15

# 3. CHARGEMENT DU REGISTRE ET LISTE DES EXISTANTS
registry_path = 'audits/registry.json'
with open(registry_path, 'r', encoding='utf-8') as f:
    registry = json.load(f)

# On crée une liste des entités déjà présentes pour les comparer facilement
entites_existantes = [item['entity'].lower() for item in registry]

def generate_brands(secteur):
    print(f"🌬️ Mistral prospecte : {secteur}...")
    # On précise à l'IA d'être originale
    prompt = f"List {NB_PAR_SECTEUR} world-class brands in {secteur}. Format: Name | Industry. Avoid the most obvious ones if possible."
    chat_response = client.chat.complete(
        model=model,
        messages=[{"role": "user", "content": prompt}]
    )
    return chat_response.choices[0].message.content.strip().split('\n')

def create_memo(brand, industry):
    prompt = f"Write a 4-line forensic audit memo for {brand} ({industry}). Focus on data integrity. Technical tone."
    chat_response = client.chat.complete(model=model, messages=[{"role": "user", "content": prompt}])
    return chat_response.choices[0].message.content.strip()

# 4. BOUCLE DE PRODUCTION AVEC FILTRE
print(f"🚀 Vérification des doublons activée...")

for secteur in SECTEURS:
    brands = generate_brands(secteur)
    for line in brands:
        if '|' not in line: continue
        try:
            # Nettoyage du nom (on enlève les numéros "1. Rolex" -> "Rolex")
            raw_name, ind = line.split('|')
            name = raw_name.strip()
            if "." in name[:3]: # Enlève le "1. " ou "2. "
                name = name.split(".", 1)[1].strip()

            # --- LE FILTRE ---
            if name.lower() in entites_existantes:
                print(f"⏭️ Saut de {name} (Déjà dans le registre)")
                continue
            # -----------------

            safe_name = "".join([c for c in name if c.isalnum() or c in (' ', '_')]).replace(' ', '_')
            filename = f"MEMO_{safe_name}.txt"
            
            memo_text = create_memo(name, ind)
            full_content = f"ENTITY: {name}\nDATE: {datetime.now().strftime('%d-%m-%Y')}\n\n{memo_text}\n\n[NOTARIZED BY 2A AGENCY]"
            
            f_hash = hashlib.sha256(full_content.encode()).hexdigest()
            with open(f"audits/{filename}", 'w', encoding='utf-8') as f_txt:
                f_txt.write(full_content)
            
            registry.append({
                "id": f"2A-MIST-{safe_name.upper()}",
                "entity": name,
                "hash": f_hash,
                "memo": filename,
                "status": "Immutable"
            })
            entites_existantes.append(name.lower()) # On l'ajoute à la liste temporaire
            print(f"✅ Nouveau : {name}")

        except Exception as e:
            continue

# 5. SAVE
with open(registry_path, 'w', encoding='utf-8') as f:
    json.dump(registry, f, indent=4, ensure_ascii=False)

print("\n✨ Forge terminée sans aucun doublon.")