import os
import shutil
import uuid
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pdf_parser import extract_text_from_pdf
from ai_extractor import extract_events_from_text
from calendar_export import generate_ics

app = FastAPI(title="Course Date Extractor Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

global_events_store = []

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    file_id = str(uuid.uuid4())
    temp_file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text = extract_text_from_pdf(temp_file_path)
    if not text.strip():
        os.remove(temp_file_path)
        raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")
    
    try:
        events = extract_events_from_text(text)
    except ValueError as ve:
        os.remove(temp_file_path)
        raise HTTPException(status_code=400, detail=str(ve))
    
    # Store events in memory
    global global_events_store
    global_events_store.extend(events)
    
    os.remove(temp_file_path)
    
    return {"message": "Success", "events": events}

@app.get("/events")
async def get_events():
    return JSONResponse(content={"events": global_events_store})

@app.get("/calendar")
async def export_calendar():
    if not global_events_store:
        raise HTTPException(status_code=404, detail="No events extracted yet.")
    
    ics_content = generate_ics(global_events_store)
    
    return Response(
        content=ics_content,
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=course_dates.ics"}
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
