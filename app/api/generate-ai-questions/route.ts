import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const qualifications = body.qualifications || "General Aptitude & Accounting";

    const qualString = Array.isArray(qualifications) ? qualifications.join(", ") : qualifications;

    // Groq AI Prompt Updated for Psychometric Questions
    const prompt = `You are an expert technical examiner and HR behavioral analyst. 
    The candidate has the following educational qualifications and background: ${qualString}.
    
    Generate exactly 12 multiple-choice questions in total:
    - Exactly 7 advanced-level Technical questions strictly based on their core qualifications.
    - Exactly 5 Psychometric/Situational questions to test workplace ethics, culture fit, and decision-making.
    
    CRITICAL RULES:
    1. Each question MUST have exactly 5 options.
    2. The first 4 options should be plausible answers. For psychometric, option 1 should be the most ideal/ethical response.
    3. The 5th option MUST exactly be the string "I Don't Know".
    4. Provide the correct_answer exactly as it appears in the options.
    5. You MUST include a "category" field which is strictly either "Technical" or "Psychometric".
    
    Return ONLY a valid JSON object with a "questions" array. Do not include markdown formatting or intro text.
    Structure:
    {
      "questions": [
        {
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D", "I Don't Know"],
          "correct_answer": "Exact text of the correct option",
          "skill": "Core Domain Knowledge",
          "category": "Technical", // or "Psychometric"
          "difficulty": "Advanced",
          "explanation": "Short explanation"
        }
      ]
    }`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0].message.content;
    const parsedData = JSON.parse(aiContent);
    return NextResponse.json({ success: true, questions: parsedData.questions });

  } catch (error: any) {
    console.error("AI Question Generation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}