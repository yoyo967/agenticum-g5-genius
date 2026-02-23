import json
import os

# DYNAMIC SETTINGS RESOLUTION
PROJECT_ID = "online-marketing-manager"
SETTINGS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "data", "settings.json"))

# 1. Try Firestore (Cloud Truth)
try:
    import firebase_admin
    from firebase_admin import firestore
    # Note: Firebase is initialized below, so we may need a lazy fetch or double-init check
except ImportError:
    pass

def resolve_settings():
    global PROJECT_ID
    # A. Check Firestore
    try:
        if firebase_admin._apps:
            db = firestore.client()
            doc = db.collection('system_config').document('global').get()
            if doc.exists:
                data = doc.to_dict()
                if 'projectId' in data:
                    PROJECT_ID = data['projectId']
                    print(f"INFO: Python Engine adopting Cloud Project ID: {PROJECT_ID}")
                    return
    except Exception as e:
        print(f"DEBUG: Firestore config fetch skipped: {e}")

    # B. Fallback to Local Settings
    if os.path.exists(SETTINGS_PATH):
        try:
            with open(SETTINGS_PATH, 'r') as f:
                settings_data = json.load(f)
                if 'projectId' in settings_data:
                    PROJECT_ID = settings_data['projectId']
                    print(f"INFO: Python Engine adopting Local Project ID: {PROJECT_ID}")
        except Exception as e:
            print(f"WARNING: Failed to read settings.json for Python: {e}")

def initialize_firebase():
    global PROJECT_ID
    # Verify/Set GCP Credentials
    if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        potential_key = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "data", "firebase-key.json"))
        if os.path.exists(potential_key):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = potential_key
            print(f"INFO: Using service account key from {potential_key}")
        else:
            os.environ["GOOGLE_CLOUD_PROJECT"] = PROJECT_ID
            print(f"WARNING: GOOGLE_APPLICATION_CREDENTIALS not set. Forcing GOOGLE_CLOUD_PROJECT={PROJECT_ID}")

    import firebase_admin
    from firebase_admin import credentials, firestore
    
    try:
        firebase_admin.get_app()
    except ValueError:
        key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if key_path and os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
        else:
            firebase_admin.initialize_app()
        print("INFO: Firebase Admin SDK initialized.")

# Initial resolution from local settings
resolve_settings()
# Boot firebase
initialize_firebase()
# Try to refresh from cloud after boot
resolve_settings()

# Environment variables for other GCP SDKs (Vertex AI)
os.environ["GOOGLE_CLOUD_PROJECT"] = PROJECT_ID
os.environ["PROJECT_ID"] = PROJECT_ID
os.environ["GOOGLE_CLOUD_QUOTA_PROJECT"] = PROJECT_ID

REGION = "europe-west1"
