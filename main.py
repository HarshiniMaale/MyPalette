from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import base64

app = FastAPI()

# Enable CORS - you can replace "*" with your actual extension origin later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev/testing. Replace with ["chrome-extension://lmnilejpocddibegnohchcejechdbcih"] later.
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/fetch-image")
def fetch_image(url: str = Query(..., description="Image URL to fetch")):
    try:
        # Download the image
        response = requests.get(url, timeout=5)
        response.raise_for_status()

        # Convert to base64
        image_data = base64.b64encode(response.content).decode("utf-8")

        # Return as JSON
        return JSONResponse(content={"base64": image_data})

    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})