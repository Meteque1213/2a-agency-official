import os
import json
import hashlib
from datetime import datetime
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from dotenv import load_dotenv

# 1. Setup
load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")
client = MistralClient(api_key=api_key)
model = "mistral-small-latest"

# 2. Paramètres d'industrialisation
SECTEURS = ["Luxury Hospitality", "Web3 Infrastructure", "Sustainable Fashion", "Swiss Banking"]
NB_PAR_SECTEUR = 10 # Tu peux monter à 100 quand le test est OK

def generate_mass_brands(secteur):
    print(f"🌬️ Mistral prospecte le secteur : {secteur}...")
    prompt = f"List {NB_PAR_SECTEUR} famous brands in {secteur}. Format: Name | Industry. No text before or after."
    
    chat_response = client.chat(
        model=model,
        messages=[ChatMessage(role="user", content=prompt)]
    )
    return chat_response.choices[0].message.content.strip().split('\n')

def create_forensic_memo(brand, industry):
    prompt = f"Write a 4-line technical audit memo for {brand} ({industry}). Focus on data integrity and ERC-8004 notarization. Cold, professional tone."
    
    chat_response = client.chat(
        model=model,
        messages=[ChatMessage(role="user", content=prompt)]
    )
    memo_text = chat_response.choices[0].message.content.strip()
    
    timestamp = datetime.now().strftime("%d-%m-%Y / %H:%M")
    return f"ENTITY: {brand}\nDATE: {timestamp}\n\n{memo_text}\n\n[SYSTEM OF RECORD - 2A AGENCY]"

# 3. Main Loop
registry_path = 'audits/registry.json'
with open(registry_path, 'r') as f:
    registry = json.load(f)

for secteur in SECTEURS:
    brands = generate_mass_brands(secteur)
    for line in brands:
        if '|' not in line: continue
        try:
            name, ind = line.split('|')
            name = name.strip()
            safe_name = name.replace(' ', '_').replace('/', '')
            filename = f"MEMO_{safe_name}.txt"
            
            content = create_forensic_memo(name, ind)
            f_hash = hashlib.sha256(content.encode()).hexdigest()
            
            # Sauvegarde .txt
            with open(f"audits/{filename}", 'w') as f_txt:
                f_txt.write(content)
            
            # Update Registry
            registry.append({
                "id": f"2A-MISTRAL-{safe_name.upper()}",
                "brand": name,
                "hash": f_hash,
                "memo": filename,
                "status": "Immutable"
            })
            print(f"✅ Mistral a forgé : {name}")
        except: continue

# 4. Save
with open(registry_path, 'w') as f:
    json.dump(registry, f, indent=4)

print("\n🚀 Forge Mistral terminée ! Relance le sitemap et push.")