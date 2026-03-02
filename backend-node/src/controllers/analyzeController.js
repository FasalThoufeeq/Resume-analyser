import {
    parseJobDescription,
    parseResume,
    calculateMatchScore,
    detectKeywords,
    rewriteResumeSections,
    analyzeGithub
} from '../services/llm.js';
import { extractTextWithPython, calculateSimilarityWithPython } from '../services/pythonService.js';

export const analyzeResume = async (req, res) => {
    try {
        const { jobDescription, githubUrl } = req.body;
        const file = req.file;

        if (!jobDescription || !file) {
            return res.status(400).json({ error: "Job description and resume file are required." });
        }

        console.log("1. Extracting text from resume...");
        const resumeText = await extractTextWithPython(file.buffer, file.originalname);

        console.log("2. Calculating base embedding similarity...");
        const baseEmbeddingScore = await calculateSimilarityWithPython(jobDescription, resumeText);

        console.log(`Base embedding score: ${baseEmbeddingScore}%`);

        // Run JD and Resume parsing in parallel
        console.log("3. Parsing JD and Resume with LLM...");
        const [jdJson, resumeJson] = await Promise.all([
            parseJobDescription(jobDescription),
            parseResume(resumeText)
        ]);

        console.log("4. Running ATS specific LLM prompts...");
        // Run Scoring, Keywords, and Rewrite in parallel
        const [scoreResult, keywordsResult, rewriteResult] = await Promise.all([
            calculateMatchScore(jdJson, resumeJson, baseEmbeddingScore),
            detectKeywords(jdJson, resumeJson),
            rewriteResumeSections(jdJson, resumeJson)
        ]);

        let githubResult = null;
        if (githubUrl) {
            console.log("5. Analyzing Github...");
            githubResult = await analyzeGithub(githubUrl, jdJson, resumeJson);
        }

        console.log("Analysis complete.");

        // Combine response
        return res.json({
            status: "success",
            data: {
                base_embedding_score: baseEmbeddingScore,
                job_description_parsed: jdJson,
                resume_parsed: resumeJson,
                match_results: scoreResult,
                keyword_analysis: keywordsResult,
                rewrite_suggestions: rewriteResult,
                github_analysis: githubResult
            }
        });

    } catch (error) {
        console.error("Error during analysis:", error);
        res.status(500).json({ error: "An error occurred during resume analysis.", details: error.message });
    }
};
