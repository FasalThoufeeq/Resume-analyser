from sentence_transformers import SentenceTransformer, util
import numpy as np
import re

# Initialize the model (downloads on first run)
# 'all-MiniLM-L6-v2' is a good balance of speed and performance for general semantic similarity
model = SentenceTransformer('all-MiniLM-L6-v2')

def clean_text(text: str) -> str:
    """
    Clean the text by removing extra whitespace and special characters.
    """
    # Remove multiple spaces and newlines
    text = re.sub(r'\s+', ' ', text)
    # Basic cleaning, can be expanded based on specific needs
    return text.strip()

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Chunk text into smaller pieces for better embedding representation.
    Though for JD vs Resume, sometimes whole document embedding is sufficient if not too long,
    chunking can help capture specific details better.
    """
    # Simple word-based chunking for demonstration
    words = text.split()
    chunks = []
    
    if len(words) <= chunk_size:
        return [text]
        
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        
    return chunks

def get_embeddings(texts: list[str]) -> np.ndarray:
    """
    Generate embeddings for a list of texts.
    """
    return model.encode(texts)

def calculate_similarity(job_description: str, resume_text: str) -> float:
    """
    Calculate the cosine similarity between the Job Description and the Resume.
    Returns a score between 0 and 100.
    """
    clean_jd = clean_text(job_description)
    clean_resume = clean_text(resume_text)
    
    # For a high-level match score, embedding the whole document often gives a good baseline.
    jd_embedding = model.encode([clean_jd])
    resume_embedding = model.encode([clean_resume])
    
    # Calculate cosine similarity using sentence-transformers util
    similarity = util.cos_sim(jd_embedding, resume_embedding)[0][0]
    
    # Convert to a percentage score (0-100)
    # Cosine similarity is usually between -1 and 1, but for text embeddings it's mostly 0 to 1
    # We clip it between 0 and 1 just in case, then multiply by 100
    score = max(0.0, min(1.0, float(similarity))) * 100.0
    
    return round(score, 2)
