import kuzu
import os
import json
import glob

# Standardisation
DB_PATH = "notary.db"
NODES_DIR = "./data/nodes"

def setup():
    # Nettoyage si besoin pour repartir à neuf
    if os.path.exists(DB_PATH):
        import shutil
        shutil.rmtree(DB_PATH)
        print("🧹 Ancienne base nettoyée.")

    db = kuzu.Database(DB_PATH)
    conn = kuzu.Connection(db)

    print("🏗️  Initialisation du schéma Sentinel...")
    
    try:
        # 1. Création des tables (On évite le mot 'Group')
        conn.execute("CREATE NODE TABLE Brand(name STRING, country STRING, year INT, PRIMARY KEY (name))")
        conn.execute("CREATE NODE TABLE Holding(name STRING, PRIMARY KEY (name))")
        conn.execute("CREATE REL TABLE BELONGS_TO(FROM Brand TO Holding)")
        print("✅ Tables 'Brand', 'Holding' et relations créées.")
    except Exception as e:
        print(f"❌ Erreur schéma : {e}")

    # 2. Ingestion automatique des 100 fichiers JSON
    print(f"📂 Lecture des nœuds dans {NODES_DIR}...")
    node_files = glob.glob(os.path.join(NODES_DIR, "*.json"))
    
    count = 0
    for file_path in node_files:
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                brand_name = data.get('name', 'Unknown').replace("'", " ")
                country = data.get('metadata', {}).get('country', 'FR')
                year = data.get('metadata', {}).get('year', 0)
                
                # Insertion de la marque
                conn.execute(f"CREATE (:Brand {{name: '{brand_name}', country: '{country}', year: {year}}})")
                count += 1
        except Exception as e:
            print(f"⚠️ Erreur sur {file_path}: {e}")

    print(f"\n✅ SUCCESS: {count} marques indexées dans le Graphe de Connaissance.")

    # 3. Vérification finale
    res = conn.execute("MATCH (b:Brand) RETURN count(*)")
    final_count = res.get_next()[0]
    print(f"📊 TOTAL MARQUES EN BASE : {final_count}")

if __name__ == "__main__":
    setup()