import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

def notify_google(url_to_index):
    try:
        service_account_info = {
            "type": "service_account",
            "project_id": "YOUR_PROJECT_ID",
            "private_key_id": "YOUR_PRIVATE_KEY_ID",
            "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
            "client_email": "YOUR_SERVICE_ACCOUNT_EMAIL",
            "client_id": "YOUR_CLIENT_ID",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
        }

        creds = service_account.Credentials.from_service_account_info(service_account_info, scopes=SCOPES)
        
        session = requests.Session()
        auth_request = Request()
        creds.refresh(auth_request)
        
        body = {"url": url_to_index, "type": "URL_UPDATED"}
        headers = {"Content-Type": "application/json", "Authorization": f"Bearer {creds.token}"}
        
        response = session.post(ENDPOINT, json=body, headers=headers)
        
        if response.status_code == 200:
            print("SUCCESS! URL sent to Google successfully!")
        else:
            print(f"Error from Google: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    target_url = "https://kemo-777.github.io/aura-global-ai-propadvisor/"
    print("Sending request to Google Indexing API...")
    notify_google(target_url)