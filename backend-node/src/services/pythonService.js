import axios from 'axios';
import FormData from 'form-data';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

/**
 * Extract text from uploaded PDF/DOCX using Python microservice
 */
export async function extractTextWithPython(fileBuffer, originalFilename) {
    try {
        const formData = new FormData();
        formData.append('file', fileBuffer, originalFilename);

        const response = await axios.post(`${PYTHON_SERVICE_URL}/extract-text`, formData, {
            headers: formData.getHeaders(),
        });
        return response.data.text;
    } catch (error) {
        console.error("Error calling Python microservice for text extraction:", error.message);
        throw new Error("Failed to extract text from document.");
    }
}

/**
 * Calculate Cosine Similarity using Python microservice
 */
export async function calculateSimilarityWithPython(jobDescription, resumeText) {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/calculate-similarity`, {
            job_description: jobDescription,
            resume_text: resumeText
        });
        return response.data.similarity_score;
    } catch (error) {
        console.error("Error calling Python microservice for similarity:", error.message);
        // Fallback score if microservice fails but we still want LLM to run
        return 0;
    }
}
