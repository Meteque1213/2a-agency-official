import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin

# Cibles stratégiques pour valider la crédibilité
TARGETS = {
    "LVMH": "https://www.lvmh.fr/actionnaires/publications/",
    "Kering": "https://www.kering.com/fr/finance/publications/rapports-annuels-et-documents-d-enregistrement-universel/",
    "Hermès": "https://finance.hermes.com/fr/publications/",
    "Richemont": "https://www.richemont.com/en/investors/results-reports/",
    "Ferrari": "https://www.ferrari.com/en-EN/corporate/investors-financial-results"
}

def get_financial_proof(brand, url):
    print(f"\n🔍 Scan en cours : {brand}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=20)
        soup = BeautifulSoup(response.text, 'html.parser')
        links = soup.find_all('a', href=True)
        
        # On cherche les PDFs qui sentent bon la finance (2024 ou 2023)
        patterns = [r'2024', r'2023', r'URD', r'Universal', r'Registration', r'Annual', r'Rapport']
        
        found_pdfs = []
        for link in links:
            href = link['href']
            text = link.get_text().strip().lower()
            
            if href.lower().endswith('.pdf'):
                # Score de pertinence pour trouver le VRAI rapport annuel
                if any(re.search(p, href, re.I) for p in patterns) or any(re.search(p, text, re.I) for p in patterns):
                    full_url = urljoin(url, href)
                    found_pdfs.append(full_url)
        
        if found_pdfs:
            # On prend le premier (généralement le plus récent en haut de page)
            print(f"✅ SUCCÈS pour {brand} : {found_pdfs[0]}")
            return found_pdfs[0]
        else:
            print(f"❌ Aucun PDF financier trouvé pour {brand}")
            return None

    except Exception as e:
        print(f"⚠️ Erreur sur {brand}: {e}")
        return None

# Lancement du test
print("🚀 DÉMARRAGE DU FINANCIAL SENTINEL V2")
final_results = {}

for brand, url in TARGETS.items():
    pdf_link = get_financial_proof(brand, url)
    final_results[brand] = pdf_link

print("\n" + "="*50)
print("📊 RÉCAPITULATIF POUR TON REGISTRY")
print("="*50)
for brand, link in final_results.items():
    status = "OK" if link else "MANQUANT"
    print(f"{brand.ljust(10)} | {status.ljust(8)} | {link}")