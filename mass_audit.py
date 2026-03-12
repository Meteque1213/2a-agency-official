import pandas as pd
import requests
from bs4 import BeautifulSoup
import time

def calculate_ai_iq(url):
    if pd.isna(url) or url == "":
        return 0
    try:
        # Simulation d'un scan d'intégrité (RAG Readiness)
        headers = {'User-Agent': '2A-Agency-Audit-Agent/1.0'}
        response = requests.get(url, headers=headers, timeout=10)
        
        score = 50 # Base score
        
        # Facteurs d'audit technique
        if response.status_code == 200:
            score += 10 # Accessible
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Détection de la présence de JSON-LD (Données structurées pour IA)
            if soup.find('script', type='application/ld+json'):
                score += 15
            
            # Détection de la protection anti-bot (Legacy Barrier)
            if "cloudflare" in response.text.lower():
                score -= 10
                
            # Détection de blockchain/notarization mentions
            if any(term in response.text.lower() for term in ['blockchain', 'verify', 'notarized', 'erc-8004']):
                score += 20
        
        return min(98, score) # Cap à 98 pour Hermès
    except:
        return 5 # Score minimal si le site bloque les agents

# Chargement de la base
df = pd.read_csv('master_audit.csv')

# Correction du header si nécessaire (on saute la ligne 2 si doublon)
if df.iloc[0,0] == "Marque":
    df = df.drop(df.index[0])

print(f"🚀 Lancement de l'audit pour {len(df)} marques...")

# Scan massif
for index, row in df.iterrows():
    if pd.isna(row['Résultat Audit 2A']) or row['Résultat Audit 2A'] == "":
        url = row['URL Officielle'] if pd.notna(row['URL Officielle']) else row['URL']
        print(f"🔍 Audition de : {row['Marque']}...")
        df.at[index, 'Résultat Audit 2A'] = calculate_ai_iq(url)
        time.sleep(0.5) # Protection contre le ban

# Sauvegarde
df.to_csv('registry_final_audit.csv', index=False)
print("✅ Audit terminé. Fichier prêt : registry_final_audit.csv")