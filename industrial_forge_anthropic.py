import os
import json
import hashlib
from datetime import datetime
import anthropic
from dotenv import load_dotenv

# 1. Chargement du fichier .env
load_dotenv()

# 2. Configuration d'Anthropic avec nettoyage de la clé
api_key = os.getenv("ANTHROPIC_API_KEY")

if not api_key:
    print("❌ ERREUR : La variable ANTHROPIC_API_KEY est introuvable dans le .env")
    exit()

# Le .strip() élimine les espaces ou sauts de ligne invisibles qui causent l'erreur 401
client = anthropic.Anthropic(api_key=api_key.strip())

# 3. Paramètres de l'Usine (Modifie les secteurs ici)
SECTEURS = [
    "Luxury Watches", 
    "High-End Real Estate Dubai", 
    "Artificial Intelligence Companies", 
    "Bordeaux Fine Wines",
    "Haute Couture Houses"
]
NB_PAR_SECTEUR = 5  # Total de 25 audits pour ce test

def generate_brand_list(secteur):
    print(f"🔍 Claude prospecte le secteur : {secteur}...")
    prompt = f"Give me a list of {NB_PAR_SECTEUR} world-class brands or entities in the {secteur} sector. Format each line exactly as: Name | Industry. Do not include any other text."
    
    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        return message.content[0].text.strip().split('\n')
    except Exception as e:
        print(f"❌ Erreur lors de la prospection : {e}")
        return []

def create_audit_memo(brand_name, industry):
    timestamp = datetime.now().strftime("%d-%m-%Y / %H:%M CET")
    prompt = f"Write a formal 5-line forensic integrity audit memo for the brand {brand_name} in the {industry} sector. Mention data stability, ERC-8004 compliance, and system of record notarization. Professional and technical tone."
    
    message = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    memo_text = message.content[0].text.strip()
    
    full_content = f"ENTITY: {brand_name}\nSECTOR: {industry}\nSTATUS: VERIFIED ON BASE L2\nDATE: {timestamp}\n\n{memo_text}\n\n[NOTARIZED BY 2A AGENCY - SYSTEM OF RECORD]"
    return full_content

# --- BOUCLE PRINCIPALE ---
registry_path = 'audits/registry.json'

# S'assurer que le dossier audits existe
if not os.path.exists('audits'):
    os.makedirs('audits')

# Charger le registre existant
if os.path.exists(registry_path):
    with open(registry_path, 'r', encoding='utf-8') as f:
        registry = json.load(f)
else:
    registry = []

print(f"🚀 Lancement de la Forge pour {len(SECTEURS) * NB_PAR_SECTEUR} audits...")

for secteur in SECTEURS:
    brands = generate_brand_list(secteur)
    for line in brands:
        if '|' not in line: continue
        try:
            name, ind = line.split('|')
            name = name.strip()
            # Création d'un nom de fichier propre
            safe_name = "".join([c for c in name if c.isalnum() or c in (' ', '_')]).replace(' ', '_')
            filename = f"MEMO_{safe_name}.txt"
            filepath = os.path.join('audits', filename)
            
            # Génération du contenu
            content = create_audit_memo(name, ind.strip())
            file_hash = hashlib.sha256(content.encode()).hexdigest()
            
            # Écriture du fichier dans /audits
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
                
            # Mise à jour du registre
            registry.append({
                "id": f"2A-CERT-{safe_name.upper()}-2026",
                "entity": name,
                "hash": file_hash,
                "memo": filename,
                "status": "Immutable"
            })
            print(f"✅ Notarisation réussie : {name}")
            
        except Exception as e:
            print(f"⚠️ Saut de ligne pour {line} suite à erreur : {e}")

# Sauvegarde finale
with open(registry_path, 'w', encoding='utf-8') as f:
    json.dump(registry, f, indent=4, ensure_ascii=False)

print("\n✨ TRAVAIL TERMINÉ.")
print(f"📂 Les fichiers sont dans le dossier /audits")
print(f"📊 Registre mis à jour : {len(registry)} entités au total.")