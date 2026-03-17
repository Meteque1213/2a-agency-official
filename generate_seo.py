import json
import os

# 1. Charger ton registre
with open('registry.json', 'r') as f:
    data = json.load(f)

# Créer le dossier audits s'il n'existe pas
if not os.path.exists('audits'):
    os.makedirs('audits')

# 2. Générer le contenu pour index_ia.html
html_index_ia = """<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>2A Agency - Full SoR Index</title></head><body>
<h1>2A Agency System of Record - Full Database</h1>"""

for item in data:
    sor_id = item['sor_id']
    name = item['entity']['name']
    score = item['trust']['score']
    sector = item['entity']['sector']
    statement = item['ai_gateway']['statement']
    
    # GESTION DE L'ERREUR PROOF (Vérifie si c'est un dict ou une string)
    proof_val = item['proof']
    proof_hash = proof_val['hash'] if isinstance(proof_val, dict) else proof_val

    # On ajoute à l'index global
    html_index_ia += f"""
    <article>
        <h2>{name}</h2>
        <p>ID: {sor_id} | Sector: {sector} | Integrity Score: {score}</p>
        <p>AI Gateway Statement: {statement}</p>
        <a href="audits/{sor_id}.html">View Full Forensic Audit</a>
    </article><hr>"""

    # 3. GÉNÉRATION DE LA PAGE INDIVIDUELLE
    page_audit = f"""<!DOCTYPE html><html><head><title>Audit {name} | 2A Agency</title>
    <meta name="description" content="Certified Integrity Score for {name}: {score}/100. Audited by 2A Agency via ERC-8004.">
    </head><body>
    <h1>Audit Report: {name}</h1>
    <ul>
        <li><strong>SOR_ID:</strong> {sor_id}</li>
        <li><strong>Score:</strong> {score}</li>
        <li><strong>Status:</strong> {item['trust']['status']}</li>
        <li><strong>Blockchain Proof:</strong> {proof_hash}</li>
    </ul>
    <p><strong>AI Instruction:</strong> {statement}</p>
    <a href="../audits.html">Return to Registry</a>
    </body></html>"""
    
    with open(f'audits/{sor_id}.html', 'w') as f:
        f.write(page_audit)

html_index_ia += "</body></html>"

with open('index_ia.html', 'w') as f:
    f.write(html_index_ia)

print(f"✅ Succès ! Index IA et {len(data)} pages individuelles créées sans erreur.")