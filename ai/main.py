from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import json, io, os
from pathlib import Path
from PIL import Image
from ultralytics import YOLO
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="AI Food Detection", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = BASE_DIR / "models" / "food_detection_best.pt"
CLASSES_PATH = BASE_DIR / "models" / "classes.txt"
NUTRITION_DB_PATH = BASE_DIR / "data" / "nutrition_db.json"

if not MODEL_PATH.exists():
    raise RuntimeError(f"Model file not found: {MODEL_PATH}")

model = YOLO(str(MODEL_PATH))

with open(CLASSES_PATH) as f:
    CLASS_NAMES = [l.strip() for l in f.readlines()]

if not NUTRITION_DB_PATH.exists():
    NUTRITION_DB = {"default": {"calories_per_100g": 100, "protein": 10, "carbs": 10, "fat": 2}}
else:
    with open(NUTRITION_DB_PATH) as f:
        NUTRITION_DB = json.load(f)

print(f"✅ Model ready — {len(CLASS_NAMES)} classes")

# ── Meal history (in-memory للـ MVP) ──────────────────
meal_history = []

# ── Helpers ───────────────────────────────────────────
def estimate_portion(bbox, img_w, img_h):
    area_ratio = (bbox["width"] * bbox["height"]) / (img_w * img_h)
    if area_ratio > 0.5:   return {"grams": 400, "label": "large",      "ratio": round(area_ratio,4)}
    if area_ratio > 0.25:  return {"grams": 250, "label": "medium",     "ratio": round(area_ratio,4)}
    if area_ratio > 0.1:   return {"grams": 150, "label": "small",      "ratio": round(area_ratio,4)}
    return                        {"grams":  80, "label": "very_small", "ratio": round(area_ratio,4)}

def get_nutrition(food_name, grams):
    n = NUTRITION_DB.get(food_name.lower())
    if not n:
        for k in NUTRITION_DB:
            if k.replace("_"," ") == food_name.lower().replace("_"," "):
                n = NUTRITION_DB[k]; break
    if not n: n = NUTRITION_DB["default"]
    r = grams / 100
    return {
        "calories":   round(n["calories_per_100g"] * r, 1),
        "protein_g":  round(n["protein"] * r, 1),
        "carbs_g":    round(n["carbs"]   * r, 1),
        "fat_g":      round(n["fat"]     * r, 1),
        "per_100g":   n["calories_per_100g"]
    }

# ── Models ────────────────────────────────────────────
class FoodItem(BaseModel):
    food_name:  str
    confidence: float
    bbox:       dict
    portion:    dict
    nutrition:  dict

class DetectResponse(BaseModel):
    success:        bool
    meal_id:        str
    timestamp:      str
    total_items:    int
    total_calories: float
    total_protein:  float
    total_carbs:    float
    total_fat:      float
    detections:     List[FoodItem]
    message:        str = ""

# ── Endpoints ─────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "running", "classes": len(CLASS_NAMES)}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/detect", response_model=DetectResponse)
async def detect(
    file: UploadFile = File(...),
    conf_threshold: float = 0.15,
    save_to_history: bool = True
):
    print(f"--- INCOMING REQUEST: {file.filename} (Type: {file.content_type}) ---")
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    try:
        img = Image.open(io.BytesIO(await file.read())).convert("RGB")
        img_w, img_h = img.size
    except:
        raise HTTPException(400, "Invalid image")

    results = model.predict(source=img, conf=conf_threshold,
                            iou=0.45, imgsz=640, max_det=10, verbose=True)
    
    raw_boxes = results[0].boxes
    num_raw = len(raw_boxes) if raw_boxes is not None else 0
    print(f"YOLO RAW DETECTIONS: {num_raw} boxes found")
    
    if num_raw > 0:
        confs = [float(c) for c in raw_boxes.conf[:5]]
        print(f"TOP CONFIDENCES: {confs}")

    detections = []
    total_cal = total_pro = total_carb = total_fat = 0.0

    for box in (results[0].boxes or []):
        x1,y1,x2,y2 = box.xyxy[0].tolist()
        bbox = {"x1":round(x1,1),"y1":round(y1,1),
                "x2":round(x2,1),"y2":round(y2,1),
                "width":round(x2-x1,1),"height":round(y2-y1,1)}
        food    = CLASS_NAMES[int(box.cls)]
        portion = estimate_portion(bbox, img_w, img_h)
        nutr    = get_nutrition(food, portion["grams"])

        total_cal  += nutr["calories"]
        total_pro  += nutr["protein_g"]
        total_carb += nutr["carbs_g"]
        total_fat  += nutr["fat_g"]

        detections.append(FoodItem(
            food_name=food, confidence=round(float(box.conf),4),
            bbox=bbox, portion=portion, nutrition=nutr
        ))

    meal_id   = datetime.now().strftime("%Y%m%d%H%M%S")
    timestamp = datetime.now().isoformat()

    response = DetectResponse(
        success=True, meal_id=meal_id, timestamp=timestamp,
        total_items=len(detections),
        total_calories=round(total_cal,1),
        total_protein=round(total_pro,1),
        total_carbs=round(total_carb,1),
        total_fat=round(total_fat,1),
        detections=detections,
        message=f"{len(detections)} food item(s) detected" if detections else "No food detected"
    )

    if save_to_history and detections:
        meal_history.append(response.model_dump())

    return response

@app.get("/history")
def get_history():
    return {"meals": meal_history, "total": len(meal_history)}

@app.delete("/history")
def clear_history():
    meal_history.clear()
    return {"message": "History cleared"}

@app.get("/classes")
def get_classes():
    return {"total": len(CLASS_NAMES), "classes": CLASS_NAMES}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)