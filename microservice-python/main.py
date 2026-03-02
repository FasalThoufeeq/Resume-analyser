from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from pydantic import BaseModel
import uvicorn
from services.parser import extract_text_from_file
from services.embeddings import calculate_similarity

app = FastAPI(title="Resume Analyzer AI Microservice")

class SimilarityRequest(BaseModel):
    job_description: str
    resume_text: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        content = await file.read()
        text = extract_text_from_file(content, file.filename)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")

@app.post("/calculate-similarity")
async def get_similarity(request: SimilarityRequest):
    try:
        score = calculate_similarity(request.job_description, request.resume_text)
        return {"similarity_score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating similarity: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
