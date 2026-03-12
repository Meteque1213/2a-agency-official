import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin
import time

# MAPPING OPTIMISÉ (Correction des 404 et chemins profonds)
REGISTRY_MAPPING = {
    "Hermès": "https://finance.hermes.com/fr/publications/",
    "LVMH": "https://www.lvmh.fr/actionnaires/publications/",
    "Kering": "https://www.kering.com/fr/finance/publications/rapports-annuels-et-documents-d-enregistrement-universel/",
    "Richemont": "https://www.richemont.com/en/investors/results-reports/",
    "Ferrari": "https://www.ferrari.com/en-EN/corporate/investors-financial-results",
    "Prada Group": "https://www.pradagroup.com/en/investors/reports-and-results.html",
    "Moncler": "https://www.monclergroup.com/en/investor-relations/results-and-reports",
    "Zegna": "https://ir.zegnagroup.com/financial-information/financial-results",
    "Mercedes-Benz": "https://group.mercedes-benz.com/investors/reports-news/annual-reports/",
    "Porsche": "https://investorrelations.porsche.com/en/financial-reports/",
    "BMW Group": "https://www.bmwgroup.com/en/investor-relations/financial-reports.html",
    "Airbus": "https://www.airbus.com/en/investors/financial-results-and-annual-reports"
}

def mass_financial_scan(mapping):
    print(f"🚀 [2A AGENCY] - V4 STEALTH AUDIT STARTING\n")
    
    # Headers "Furtifs" pour contourner les 403 (Mode Navigateur Réel)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.google.com/',
        'Connection': 'keep-alive'
    }
    
    final_updates = []

    for name, url in mapping.items():
        print(f"📡 Probing {name}...")
        try:
            time.sleep(2) # Pause plus longue pour éviter le fingerprinting
            response = requests.get(url, headers=headers, timeout=25, allow_redirects=True)
            
            if response.status_code != 200:
                print(f"  🚨 {name}: HTTP {response.status_code}")
                final_updates.append({"name": name, "status": f"ERROR_{response.status_code}", "proof": None})
                continue

            soup = BeautifulSoup(response.text, 'html.parser')
            links = soup.find_all('a', href=True)
            
            # Pattern plus large pour capturer les documents institutionnels
            patterns = [r'2024', r'2025', r'URD', r'Universal', r'Registration', r'Annual', r'Rapport', r'Reference']
            
            found_url = None
            for link in links:
                href = link['href']
                text = link.get_text().strip()
                if href.lower().endswith('.pdf'):
                    if any(re.search(p, href, re.I) or re.search(p, text, re.I) for p in patterns):
                        found_url = urljoin(url, href)
                        break
            
            if found_url:
                print(f"  ✅ {name}: Proof Captured.")
                final_updates.append({"name": name, "status": "VERIFIED", "proof": found_url})
            else:
                print(f"  ⚠️ {name}: Page readable but PDF hidden (JS issue?).")
                final_updates.append({"name": name, "status": "PDF_NOT_FOUND", "proof": None})

        except Exception as e:
            print(f"  🚨 {name}: Exception during scan.")
            final_updates.append({"name": name, "status": "FAILED", "proof": None})

    return final_updates

# Exécution
updates = mass_financial_scan(REGISTRY_MAPPING)

print("\n" + "="*80)
print("💎 2A REGISTRY - V4 STEALTH SUMMARY")
print("="*80)
for item in updates:
    print(f"{item['name'].ljust(20)} | {item['status'].ljust(15)} | {item['proof']}")