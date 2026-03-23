import json
from datetime import datetime

# Configuration
DOMAIN = "https://2aagency.com"
REGISTRY_FILE = 'registry.json'
SITEMAP_FILE = 'sitemap.xml'

def generate_sitemap():
    try:
        # On force l'encodage utf-8 pour éviter les erreurs sur les noms accentués
        with open(REGISTRY_FILE, 'r', encoding='utf-8') as f:
            nodes = json.load(f)
    except FileNotFoundError:
        print("Erreur : registry.json non trouvé.")
        return

    today = datetime.now().strftime('%Y-%m-%d')
    
    # Entêtes du sitemap
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        # Pages statiques prioritaires
        f'  <url><loc>{DOMAIN}/index.html</loc><priority>1.0</priority><lastmod>{today}</lastmod></url>',
        f'  <url><loc>{DOMAIN}/audits.html</loc><priority>0.9</priority><lastmod>{today}</lastmod></url>',
        f'  <url><loc>{DOMAIN}/whitepaper.html</loc><priority>0.8</priority><lastmod>{today}</lastmod></url>'
    ]

    # Ajout des 1056 Trust Nodes
    for node in nodes:
        sor_id = node.get('sor_id')
        if sor_id:
            # CORRECTION : Ajout du 's' à audits pour correspondre à ton dossier GitHub
            url = f"{DOMAIN}/audits/{sor_id}.html"
            lines.append(f'  <url>')
            lines.append(f'    <loc>{url}</loc>')
            lines.append(f'    <lastmod>{today}</lastmod>')
            lines.append(f'    <priority>0.7</priority>')
            lines.append(f'  </url>')

    lines.append('</urlset>')

    with open(SITEMAP_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print(f"✅ Sitemap généré avec succès : {len(nodes) + 3} URLs indexées avec le chemin /audits/.")

if __name__ == "__main__":
    generate_sitemap()