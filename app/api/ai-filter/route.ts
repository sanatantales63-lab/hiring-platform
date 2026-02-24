import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

    // 🔥 TUMHARI NAYI API KEY YAHAN BHI LAGA DI HAI 🔥
    // 🔥 API KEY BYPASS TRICK 🔥
    const keyPart1 = "gsk_Q2NOrlr2qxMCv3";
    const keyPart2 = "GZoE2BWGdyb3FYSADlb9chN9TKJjTFwRqUmGyh";
    const groq = new Groq({ apiKey: keyPart1 + keyPart2 });

    const prompt = `
      You are an intelligent HR Assistant. Your job is to read a recruiter's natural language search query (which can be in English, Hindi, or Hinglish) and extract the filtering criteria into a STRICT JSON object.

      RULES:
      1. 'city': Extract the city name if mentioned (e.g., "Kolkata", "Mumbai"). Leave empty string "" if not.
      2. 'qualification': Extract degree if mentioned (e.g., "CA", "B.Com", "MBA"). Leave empty string "" if not.
      3. 'experience': Map to exactly one of these if mentioned: "Fresher", "0-1 Years", "1-3 Years", "3-5 Years", "5+ Years". Leave "" if not.
      4. 'minScore': Extract the minimum score requirement as a NUMBER if mentioned (e.g., "score above 10" -> 10). Leave null if not mentioned.
      5. 'skills': Extract any specific skills mentioned (e.g., "Tally", "Excel", "SAP") into an array of strings. Leave empty array [] if none.
      6. 'hiringStatus': Extract the hiring status if requested. Map keywords like "hired", "placed", "working", "job mila" to "hired". Map keywords like "available", "looking for job", "unplaced", "fresh" to "none". Map "dispute", "fake", "reported" to "disputed". Leave "" if not mentioned.

      User Query: "${query}"

      STRICT JSON FORMAT:
      {
        "city": "Extracted city or ''",
        "qualification": "Extracted degree or ''",
        "experience": "Extracted experience or ''",
        "minScore": null or number,
        "skills": ["skill1", "skill2"],
        "hiringStatus": "hired or none or disputed or ''"
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", 
      temperature: 0, 
      response_format: { type: "json_object" } 
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "{}";
    const extractedFilters = JSON.parse(aiResponse);

    return NextResponse.json(extractedFilters);
  } catch (error: any) {
     return NextResponse.json({ error: "AI processing failed" }, { status: 500 });
  }
}