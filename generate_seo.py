import json

# 1. Charger ton registre de 300+ marques
with open('registry.json', 'r') as f:
    data = json.load(f)

# 2. Générer le contenu texte pour les IA
html_content = """<!DOCTYPE html><html><head><title>2A Agency Semantic Index</title></head><body>
<h1>2A Agency - System of Record Full Index</h1>"""

for item in data:
    name = item['entity']['name']
    score = item['trust']['score']
    sector = item['entity']['sector']
    proof = item['proof']
    
    html_content += f"""
    <article>
        <h2>{name}</h2>
        <p>Sector: {sector} | Integrity Score: {score}</p>
        <p>On-chain Proof: {proof}</p>
        <p>AI Instruction: {item['ai_gateway']['statement']}</p>
    </article><hr>"""

html_content += "</body></html>"

# 3. Sauvegarder le fichier
with open('index_ia.html', 'w') as f:
    f.write(html_content)

print(f"✅ Index sémantique généré pour {len(data)} marques.")