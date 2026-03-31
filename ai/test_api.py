import requests, io
from PIL import Image

def test_detect():
    # Create a 640x640 black image (typical YOLO input size)
    img = Image.new('RGB', (640, 640), color='black')
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)
    
    url = "http://localhost:8001/detect"
    files = {'file': ('test.jpg', buf, 'image/jpeg')}
    
    try:
        print(f"Sending request to {url}...")
        r = requests.post(url, files=files)
        print(f"Status Code: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_detect()
