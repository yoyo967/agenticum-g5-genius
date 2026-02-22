import os

# FORCE PROJECT ID BEFORE ANY GCP IMPORTS
os.environ["GOOGLE_CLOUD_PROJECT"] = "online-marketing-manager"
os.environ["PROJECT_ID"] = "online-marketing-manager"
os.environ["GOOGLE_CLOUD_QUOTA_PROJECT"] = "online-marketing-manager"

from dotenv import load_dotenv

# Load .env from backend folder
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))
load_dotenv(env_path)

PROJECT_ID = "online-marketing-manager" 
REGION = "europe-west1"

# Verify GCP Credentials
if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
    # Attempt to find firebase-key.json in the parent data folder
    potential_key = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "data", "firebase-key.json"))
    if os.path.exists(potential_key):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = potential_key
        print(f"INFO: Using service account key from {potential_key}")
    else:
        # If no key, we rely on gcloud ADC but we MUST force the project
        os.environ["GOOGLE_CLOUD_PROJECT"] = PROJECT_ID
        print(f"WARNING: GOOGLE_APPLICATION_CREDENTIALS not set. Forcing GOOGLE_CLOUD_PROJECT={PROJECT_ID}")

# INITIALIZE FIREBASE ADMIN SDK
import firebase_admin
from firebase_admin import credentials

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
