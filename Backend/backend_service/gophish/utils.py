# sms/utils.py
import requests
from django.conf import settings

def send_sms(phone_number: str, message: str) -> dict:
    url = settings.IPROG_SMS_BASE_URL
    params = {
        "api_token": settings.IPROG_SMS_API_TOKEN,
        "message": message,
        "phone_number": phone_number
    }
    try:
        response = requests.post(url, params=params, timeout=10)
        response.raise_for_status()  # raise error if status != 200
        return response.json()
    except requests.RequestException as e:
        print("heyy error")
        return {"success": False, "error": str(e)}
