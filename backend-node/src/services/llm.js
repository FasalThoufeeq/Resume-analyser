import Anthropic from '@anthropic-ai/sdk';

// Lazily initialize Anthropic client so the server doesn't crash on startup if the key is missing
const getAnthropicClient = () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing Anthropic API Key! Please set ANTHROPIC_API_KEY in your .env file.');
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
};

/**
 * Helper to call Claude and force JSON output using Assistant Prefill
 */
async function callClaudeForJson(prompt) {
  const anthropic = getAnthropicClient();

  // We append a strict instruction to the user prompt to be safe
  const finalPrompt = prompt + "\n\nCRITICAL: Output ONLY valid JSON and absolutely nothing else. Do not wrap in markdown tags.";

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    messages: [
      { role: "user", content: finalPrompt },
      { role: "assistant", content: "{" } // Force Claude to start generating a JSON object
    ]
  });

  // Since we forced it to start with '{', we need to prepend it to the response text before parsing
  const jsonString = "{" + response.content[0].text;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse Claude JSON output:", jsonString);
    throw new Error("Claude returned invalid JSON format.");
  }
}

/**
 * 1️⃣ JOB DESCRIPTION PARSER PROMPT
 */
export async function parseJobDescription(jobDescriptionText) {
  const prompt = `
You are an expert technical recruiter and ATS parsing system.

Extract structured information from the following job description.

Return JSON with:
{
  "role_title": "",
  "experience_required": "",
  "mandatory_skills": [],
  "good_to_have_skills": [],
  "tools_and_technologies": [],
  "soft_skills": [],
  "domain_requirements": [],
  "responsibilities": [],
  "seniority_level": ""
}

Rules:
- Only extract what is clearly mentioned.
- Separate mandatory vs good-to-have carefully.
- Normalize skill names (e.g., "Nodejs" -> "Node.js")
- Do not hallucinate.

Job Description:
"""
${jobDescriptionText}
"""
    `;

  return await callClaudeForJson(prompt);
}

/**
 * 2️⃣ RESUME PARSER PROMPT
 */
export async function parseResume(resumeText) {
  const prompt = `
You are a resume intelligence parser.

Extract structured professional data from this resume.

Return JSON:
{
  "candidate_name": "",
  "total_experience_years": "",
  "technical_skills": [],
  "frameworks": [],
  "languages": [],
  "tools": [],
  "projects": [
    {
      "name": "",
      "tech_stack": [],
      "description": "",
      "impact": ""
    }
  ],
  "achievements": [],
  "certifications": []
}

Rules:
- Deduplicate skills.
- Normalize technology names.
- Infer experience level per skill if possible.
- Do not invent skills not present.

Resume:
"""
${resumeText}
"""
    `;

  return await callClaudeForJson(prompt);
}

/**
 * 3️⃣ MATCH SCORING PROMPT
 */
export async function calculateMatchScore(jdJson, resumeJson, baseEmbeddingScore) {
  const prompt = `
You are an ATS scoring engine.

Compare the job requirements and candidate profile. The base embedding cosine similarity score is ${baseEmbeddingScore}%. Use this to inform your overall assessment.

Job Description JSON:
${JSON.stringify(jdJson)}

Resume JSON:
${JSON.stringify(resumeJson)}

Return JSON:
{
  "match_percentage": 0-100,
  "matched_mandatory_skills": [],
  "missing_mandatory_skills": [],
  "matched_optional_skills": [],
  "skill_gap_analysis": "",
  "overall_assessment": ""
}

Scoring Rules:
- Mandatory skills weigh 60%
- Experience level weighs 20%
- Tools & stack alignment weighs 10%
- Domain alignment weighs 10%
- Penalize if critical mandatory skills missing
- Do not inflate score
- Be strict and realistic
    `;

  return await callClaudeForJson(prompt);
}


/**
 * 4️⃣ ATS KEYWORD DETECTOR PROMPT
 */
export async function detectKeywords(jdJson, resumeJson) {
  const prompt = `
You are an ATS keyword optimization engine.

Job Description JSON:
${JSON.stringify(jdJson)}

Resume JSON:
${JSON.stringify(resumeJson)}

Identify:
- Keywords from job description missing in resume
- Keywords underrepresented
- Resume sections that need keyword density improvement

Return JSON:
{
  "missing_keywords": [],
  "low_frequency_keywords": [],
  "suggested_keyword_insertions": [
    {
      "keyword": "",
      "where_to_add": "",
      "example_sentence": ""
    }
  ]
}
    `;

  return await callClaudeForJson(prompt);
}

/**
 * 5️⃣ RESUME REWRITE PROMPT
 */
export async function rewriteResumeSections(jdJson, resumeJson) {
  const prompt = `
You are a senior technical resume writer.

Rewrite only the necessary sections of the candidate's resume to better align with the job description.

Job Description:
${JSON.stringify(jdJson)}

Resume:
${JSON.stringify(resumeJson)}

Rules:
- Keep candidate experience truthful.
- Do NOT fabricate experience.
- Enhance impact using measurable outcomes.
- Integrate missing relevant keywords naturally.
- Improve bullet structure.
- Maintain technical authenticity.

Return improved sections only in JSON format matching the original structure where changes were made.
Return JSON format mapping original sections/projects to new proposed text.
{
  "rewritten_sections": [
     {
        "original_text": "",
        "improved_text": "",
        "reasoning": ""
     }
  ]
}
    `;

  return await callClaudeForJson(prompt);
}

/**
 * 6️⃣ GITHUB IMPROVEMENT ANALYZER (Optional)
 */
export async function analyzeGithub(githubUrl, jdJson, resumeJson) {
  // Note: To make this robust, we'd fetch actual GitHub API data here 
  // and pass it to the prompt. For now, it's a structural placeholder.
  const prompt = `
You are a senior engineering hiring manager.

Based on the candidate resume, job role, and their GitHub link (${githubUrl}), suggest improvements to their portfolio.

Job Description:
${JSON.stringify(jdJson)}

Resume:
${JSON.stringify(resumeJson)}

Suggest:
- Missing types of projects
- Weak portfolio areas
- Repo improvement suggestions
- README improvement suggestions
- High-impact project ideas to improve job chances

Be specific and practical. Return JSON:
{
  "missing_project_types": [],
  "portfolio_weaknesses": [],
  "repo_suggestions": [],
  "readme_suggestions": [],
  "high_impact_ideas": []
}
    `;

  return await callClaudeForJson(prompt);
}
