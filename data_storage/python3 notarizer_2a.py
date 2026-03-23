import hashlib
import requests

# Les cibles 2025 à notariser officiellement
TARGETS = {
    "LVMH": "https://r.lvmh-static.com/uploads/2026/02/lvmh-rapport-annuel-2025.pdf",
    "Hermès": "https://assets-finance.hermes.com/s3fs-public/node/pdf_file/2026-02/hermes_urd_2025_fr.pdf",
    "Kering": "https://www.kering.com/api/download-file/?path=Kering_URD_2025.pdf",
    "Richemont": "https://www.richemont.com/media/3vwfatyf/richemont-non-financial-report-2025.pdf",
    "Ferrari": "https://cdn.ferrari.com/cms/network/media/pdf/Ferrari_NV_Annual_Report_2025.pdf"
}

def notarize():
    print("🔐 [2A AGENCY] - STARTING CRYPTOGRAPHIC NOTARIZATION\n")
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    for brand, url in TARGETS.items():
        try:
            print(f"🧬 Processing {brand}...")
            response = requests.get(url, headers=headers, timeout=30)
            if response.status_code == 200:
                # Calcul du hash réel du PDF
                sha256_hash = hashlib.sha256(response.content).hexdigest()
                print(f"  ✅ HASH: {sha256_hash}")
                print(f"  🔗 URL: {url}\n")
            else:
                print(f"  ❌ Failed to download (Status: {response.status_code})\n")
        except Exception as e:
            print(f"  🚨 Error: {e}\n")

if __name__ == "__main__":
    notarize()