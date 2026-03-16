import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const qualifications = body.qualifications || "General Aptitude & Accounting";

    // Format qualifications to string if it's an array
    const qualString = Array.isArray(qualifications) ? qualifications.join(", ") : qualifications;

    // Prompt for Groq AI
    const prompt = `You are an expert examiner. The candidate has the following educational qualifications and background: ${qualString}. 
    Generate exactly 7 advanced-level multiple-choice questions strictly based on these core qualifications to test their actual domain knowledge.
    
    CRITICAL RULES:
    1. Each question MUST have exactly 5 options.
    2. The first 4 options should be plausible answers.
    3. The 5th option MUST exactly be the string "I Don't Know".
    4. Provide the correct answer exactly as it appears in the options (it should be one of the first 4 options).
    
    Return ONLY a valid JSON object with a "questions" array. Do not include any markdown formatting, backticks, or intro text.
    Structure:
    {
      "questions": [
        {
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D", "I Don't Know"],
          "correct_answer": "Exact text of the correct option",
          "skill": "Core Domain Knowledge",
          "difficulty": "Advanced",
          "explanation": "Short explanation"
        }
      ]
    }`;

    // Calling Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Using Llama 3 for super fast generation
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3, // Low temperature for factual accuracy
        response_format: { type: "json_object" } // Enforce JSON output
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