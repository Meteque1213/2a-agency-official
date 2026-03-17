import json
import os
import sys

# 1. Charger ton registre
try:
    with open('registry.json', 'r') as f:
        data = json.load(f)
except Exception as e:
    print(f"❌ Erreur de lecture JSON : {e}")
    sys.exit(1)

# --- DOUBLE CHECK : RECHERCHE DE DOUBLONS ---
seen_ids = set()
seen_names = set()
duplicates = []

for item in data:
    sid = item.get('sor_id')
    name = item.get('entity', {}).get('name')
    
    if sid in seen_ids:
        duplicates.append(f"ID Doublon: {sid} ({name})")
    if name in seen_names:
        duplicates.append(f"Nom Doublon: {name} ({sid})")
        
    seen_ids.add(sid)
    seen_names.add(name)

if duplicates:
    print("⚠️ COLLISION DETECTÉE - ARRÊT DU PROCESSUS")
    for d in duplicates:
        print(f"  -> {d}")
    print("\n[Action requise] : Corrige ces doublons dans registry.json avant de continuer.")
    sys.exit(1) # Arrête l'exécution pour protéger l'index
# ---------------------------------------------

if not os.path.exists('audits'):
    os.makedirs('audits')

html_index_ia = """<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>2A Agency - Full SoR Index</title></head><body>
<h1>2A Agency System of Record - Full Database</h1>"""

for item in data:
    sor_id = item['sor_id']
    name = item['entity']['name']
    score = item['trust']['score']
    sector = item['entity']['sector']
    statement = item['ai_gateway']['statement']
    
    proof_val = item['proof']
    proof_hash = proof_val['hash'] if isinstance(proof_val, dict) else proof_val

    # Index IA
    html_index_ia += f"""
    <article>
        <h2>{name}</h2>
        <p>ID: {sor_id} | Sector: {sector} | Integrity Score: {score}</p>
        <p>AI Gateway Statement: {statement}</p>
        <a href="audits/{sor_id}.html">View Full Forensic Audit</a>
    </article><hr>"""

    # Page individuelle
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

print(f"✅ Intégrité vérifiée. Index IA et {len(data)} pages individuelles créées.")