import json
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

def notify_google(url):
    try:
        creds = service_account.Credentials.from_service_account_file("service_account.json", scopes=SCOPES)
        sess = requests.Session()
        creds.refresh(Request())
        res = sess.post(ENDPOINT, json={"url": url, "type": "URL_UPDATED"}, headers={"Content-Type": "application/json", "Authorization": f"Bearer {creds.token}"})
        if res.status_code == 200:
            print("نجاح خارق! تم إرسال الرابط لجوجل!")
        else:
            print(f"خطأ: {res.text}")
    except Exception as e:
        print(f"خطأ: {e}")

if __name__ == "__main__":
    notify_google("https://kemo-777.github.io/aura-global-ai-propadvisor/")