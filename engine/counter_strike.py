from google.cloud import firestore
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
from google.cloud.firestore_v1.vector import Vector
import vertexai
from vertexai.language_models import TextEmbeddingModel

from engine.config import PROJECT_ID, REGION
import vertexai

def get_db():
    from google.cloud import firestore
    return firestore.Client(project=PROJECT_ID)

def get_embedding_model():
    from vertexai.language_models import TextEmbeddingModel
    vertexai.init(project=PROJECT_ID, location=REGION)
    return TextEmbeddingModel.from_pretrained("text-embedding-004")

def check_competitor_overlap(target_topic: str) -> list:
    """
    Sucht in Firestore Vector Search nach ähnlichen Konkurrenz-Artikeln.
    """
    # 1. Unser geplantes Thema vektorisieren
    model = get_embedding_model()
    target_embedding = model.get_embeddings([target_topic])[0].values
    
    db = get_db()
    collection = db.collection("columna_intelligence")
    
    # 2. Native Firestore Vector Search (find_nearest)
    # Sucht die 3 ähnlichsten Artikel der Konkurrenz
    threat_intel = []
    try:
        vector_query = collection.find_nearest(
            vector_field="embedding_field",
            query_vector=Vector(target_embedding),
            distance_measure=DistanceMeasure.COSINE,
            limit=3
        )
        
        results = vector_query.get()
        
        for doc in results:
            data = doc.to_dict()
            # Je nach Vektor-Distanz (Tiefer Score = Höhere Ähnlichkeit)
            threat_intel.append({
                "competitor": data.get("competitor", "Unknown"),
                "url": data.get("url", "#"),
                "their_h2_structure": [h["text"] for h in data.get("skeleton", {}).get("headings", []) if h.get("level") == "h2"]
            })
    except Exception as e:
        print(f"WARNING: Counter-Strike Vector Search failed (likely missing index): {e}")
        
    return threat_intel
