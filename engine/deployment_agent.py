import os
import hashlib
import requests
from google.auth import default
from google.auth.transport.requests import Request
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from .auth_middleware import verify_firebase_token
from .config import PROJECT_ID

router = APIRouter()

class PublishRequest(BaseModel):
    run_id: str
    html_content: str
    site_id: str  # The Firebase Subdomain (e.g., "agenticum-client-a-promo")

def get_google_access_token():
    """Fetches a fresh OAuth2 Access Token for the Firebase Hosting REST API."""
    credentials, _ = default(scopes=["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/firebase"])
    if not credentials.valid:
        credentials.refresh(Request())
    return credentials.token

def calculate_sha256(content: bytes) -> str:
    """Firebase API requires SHA256 hashes of the files."""
    return hashlib.sha256(content).hexdigest()

@router.post("/publish/advertorial")
async def publish_to_firebase(req: PublishRequest, user: dict = Depends(verify_firebase_token)):
    """
    Compiles the HTML and pushes it to Firebase Hosting via REST API.
    """
    try:
        token = get_google_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # 1. Prepare files
        files_to_upload = {
            "/index.html": req.html_content.encode("utf-8")
        }
        
        file_hashes = {
            path: calculate_sha256(content) 
            for path, content in files_to_upload.items()
        }
        
        # STEP 1: Create a new version
        version_url = f"https://firebasehosting.googleapis.com/v1beta1/sites/{req.site_id}/versions"
        version_payload = {
            "config": {
                "headers": [{"glob": "**", "headers": {"Cache-Control": "max-age=1800"}}],
                "rewrites": [{"source": "**", "destination": "/index.html"}]
            }
        }
        
        res_version = requests.post(version_url, headers=headers, json=version_payload)
        res_version.raise_for_status()
        version_name = res_version.json()["name"]
        
        # STEP 2: Populate files
        populate_url = f"https://firebasehosting.googleapis.com/v1beta1/{version_name}:populateFiles"
        populate_payload = {
            "files": {path: hash_val for path, hash_val in file_hashes.items()}
        }
        
        res_populate = requests.post(populate_url, headers=headers, json=populate_payload)
        res_populate.raise_for_status()
        populate_data = res_populate.json()
        
        upload_url = populate_data.get("uploadUrl")
        required_hashes = populate_data.get("uploadRequiredHashes", [])
        
        # STEP 3: Upload files
        for path, content in files_to_upload.items():
            file_hash = file_hashes[path]
            if file_hash in required_hashes:
                upload_file_url = f"{upload_url}/{file_hash}"
                upload_headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/octet-stream"
                }
                res_upload = requests.post(upload_file_url, headers=upload_headers, data=content)
                res_upload.raise_for_status()
        
        # STEP 4: Release the version
        release_url = f"https://firebasehosting.googleapis.com/v1beta1/sites/{req.site_id}/releases?versionName={version_name}"
        res_release = requests.post(release_url, headers={"Authorization": f"Bearer {token}"})
        res_release.raise_for_status()
        
        live_url = f"https://{req.site_id}.web.app"
        
        return {
            "status": "success",
            "message": "Maximum Excellence. Advertorial deployed.",
            "live_url": live_url,
            "run_id": req.run_id
        }
        
    except requests.exceptions.HTTPError as e:
        print(f"Firebase API Error: {e.response.text}")
        raise HTTPException(status_code=500, detail=f"Firebase Deployment failed: {e.response.text}")
    except Exception as e:
        print(f"Deployment Agent Exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))
