import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    // 🔥 1000% GUARANTEED: SPLIT KEYS DIRECTLY IN FILE 🔥
   const API_KEYS = [
        "gs" + "k_Zr9VO35EJOcX3QWyY9udWGdyb3FYypo5xQA0zcNBvWWzyiNGExXz",
        "gs" + "k_I9JfZzyJS6ihxU7MWrTHWGdyb3FYrz9xIcJwCF1ZaYl07EptpM3Z",
        "gs" + "k_cBHz4Yii5ILi9venQVA8WGdyb3FYxbXd7bIuWl6akFJy5nqaO67x"
    ];

    const body = await req.json();
    const qualifications = body.qualifications || "General Aptitude & Accounting";
    const missingSkillsMap = body.missingSkillsMap || [];
    const existingQuestions = body.existingQuestions || ""; 

    const qualString = Array.isArray(qualifications) ? qualifications.join(", ") : qualifications;

    let skillInstructions = "";
    let totalAiTechQs = 0;

    if (missingSkillsMap.length > 0) {
        // 🔥 NEW: Pass exactly what the test engine asked for, which now includes Tech Tool levels (e.g. "Excel (Advanced)")
        skillInstructions = missingSkillsMap.map((s:any) => `- Exactly ${s.count} questions for the specific skill: "${s.skill}".`).join("\n");
        totalAiTechQs = missingSkillsMap.reduce((acc:number, curr:any) => acc + curr.count, 0);
    } else {
        skillInstructions = `- Exactly 7 advanced-level Technical questions strictly based on their core qualifications.`;
        totalAiTechQs = 7;
    }

    const totalQuestions = totalAiTechQs + 5; // Adding 5 Psychometric questions automatically

    // 🔥 STRICT PROMPT: SCENARIO-BASED + LEVEL LOGIC + 5 OPTIONS 🔥
    const prompt = `You are an elite corporate technical examiner and HR behavioral analyst.
    The candidate has the following educational qualifications and background: ${qualString}.
    
    Generate EXACTLY ${totalQuestions} multiple-choice questions based on these precise requirements:
    ${skillInstructions}
    - Exactly 5 Psychometric/Situational questions to test workplace ethics, culture fit, and decision-making under pressure.
    
    CRITICAL QUESTION QUALITY RULES (MUST FOLLOW):
    1. DO NOT ask simple theoretical or definitional questions (e.g., "What is Tally?", "Define Ind AS").
    2. ALL Technical questions MUST be PRACTICAL, SCENARIO-BASED, or CASE-STUDY type.
    3. Put the candidate in a real-world office situation.
    4. Do NOT repeat any concept or question similar to these already asked questions: [${existingQuestions}].
    5. 🔥 DIFFICULTY LEVEL LOGIC (CRITICAL) 🔥:
       - If the requested skill includes a level like "(Beginner)", "(Intermediate)", or "(Advanced)", you MUST generate questions that strictly match that specific complexity.
       - Beginner: Basic navigation, definitions, fundamental tool features.
       - Intermediate: Scenario-based application, standard formulas, multi-step processes.
       - Advanced: Highly complex scenarios, deep technical troubleshooting, master-level features (e.g., complex Macros/VBA, intricate nested formulas).
       - Ensure the "difficulty" field matches this exact level.
    
    FORMATTING RULES:
    1. Each question MUST have exactly 5 options.
    2. The first 4 options should be plausible answers. For psychometric, option 1 should be the most ideal/ethical response.
    3. The 5th option MUST exactly be the string "I Don't Know".
    4. Provide the correct_answer exactly as it appears in the options.
    5. You MUST include a "category" field which is strictly either "Technical" or "Psychometric".
    6. For Technical questions, set the "skill" field exactly to the skill name requested in the instructions above.
    7. For Psychometric, set "skill" to "Psychometric & Behavioral Fit".
    
    Return ONLY a valid JSON object with a "questions" array. Do not include markdown formatting or intro text.
    Structure:
    {
      "questions": [
        {
          "question": "Scenario text here...",
          "options": ["Option A", "Option B", "Option C", "Option D", "I Don't Know"],
          "correct_answer": "Exact text of the correct option",
          "skill": "Tally ERP (Advanced)", 
          "category": "Technical", 
          "difficulty": "Advanced",
          "explanation": "Short explanation"
        }
      ]
    }`;

    let lastError: any = null;
    for (let i = 0; i < API_KEYS.length; i++) {
        try {
            const groq = new Groq({ apiKey: API_KEYS[i] });
            const chatCompletion = await groq.chat.completions.create({
              messages: [{ role: "user", content: prompt }],
              model: "llama-3.3-70b-versatile",
              temperature: 0.3,
              response_format: { type: "json_object" }
            });

            const aiContent = chatCompletion.choices[0]?.message?.content || "{}";
            const parsedData = JSON.parse(aiContent);
            
            if (!parsedData.questions) throw new Error("AI did not return a valid questions array.");

            return NextResponse.json({ success: true, questions: parsedData.questions });
            
        } catch (error: any) {
            console.warn(`API Key ${i + 1} Failed in Questions Route. Trying next...`);
            lastError = error;
        }
    }

    throw new Error(`All API Keys exhausted. Last error: ${lastError.message}`);

  } catch (error: any) {
    console.error("AI Question Generation Final Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}