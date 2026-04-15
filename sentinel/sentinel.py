import os
import kuzu
from anthropic import Anthropic, APIStatusError, NotFoundError, PermissionDeniedError
from dotenv import load_dotenv

load_dotenv()
DB_PATH = "notary.db" # STRICTEMENT IDENTIQUE
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

db = kuzu.Database(DB_PATH)
conn = kuzu.Connection(db)

def check_brand_integrity(brand_name):
    print(f"🕵️ SENTINEL actif sur : {os.path.abspath(DB_PATH)}")
    
    # Discovery (Simplifié)
    try:
        models = client.models.list()
        model_id = next((m.id for m in models.data if "sonnet" in m.id), "claude-3-5-sonnet-latest")
        
        # Audit
        message = client.messages.create(
            model=model_id,
            max_tokens=1024,
            messages=[{"role": "user", "content": f"Prix sac iconique {brand_name} et initiative RSE."}]
        )
        output = message.content[0].text
        
        # Scoring & Update
        score = 95 if "Speedy" in output or "LVMH" in output else 45
        conn.execute(f"MATCH (b:Brand {{name: '{brand_name}'}}) SET b.integrity_score = {score}")
        
        print(f"✅ VÉRITÉ VERROUILLÉE : {brand_name} -> {score}/100")
        print(f"📢 RÉPONSE : {output[:150]}...")

    except Exception as e:
        print(f"❌ Erreur : {e}")

if __name__ == "__main__":
    check_brand_integrity("lv_v1.2")