import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

// Vercel deployment fix for PDF parsing
if (typeof global !== 'undefined') {
  if (!(global as any).DOMMatrix) (global as any).DOMMatrix = class {};
  if (!(global as any).Path2D) (global as any).Path2D = class {};
}

const pdfParseLib = require('pdf-parse');
const pdfParse = pdfParseLib.default || pdfParseLib;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: "File nahi mili" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { PdfReader } = require("pdfreader");

    const resumeText = await new Promise<string>((resolve, reject) => {
      let text = "";
      new PdfReader().parseBuffer(buffer, (err: any, item: any) => {
        if (err) reject(err);
        else if (!item) resolve(text); 
        else if (item.text) text += item.text + " ";
      });
    });

    if (!resumeText || resumeText.trim() === "") throw new Error("PDF se text nahi nikal paya");

    const groq = new Groq({ apiKey: "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" });

    // 🧠 THE STRICT AI PROMPT (Now with Smart HR Salary Logic)
    const prompt = `
      You are a highly strict and accurate Expert Indian HR and Data Extractor.
      Read the provided resume text and extract the details strictly in the JSON format below.

      CRITICAL RULES:
      1. DO NOT HALLUCINATE details like names, phones, or emails.
      2. 'bio': Write a highly professional, impressive 2-line summary based ONLY on the candidate's actual skills and experience mentioned.
      3. 'panCard': Extract PAN number (Format: 5 letters, 4 numbers, 1 letter) only if explicitly mentioned.
      4. 'educations': Extract ALL qualifications. If they are CA/CMA/CS, look carefully for "Attempts" (e.g., "1st attempt", "Multiple").
      5. 'skills': Extract all technical and soft skills.
      6. 'currentSalary': Extract only if mentioned, otherwise leave empty string "".
      7. 'expectedSalary': IF EXPLICITLY MENTIONED in the resume, extract it. IF NOT MENTIONED, act as an Expert Indian HR. Calculate and suggest a realistic 'Market Standard Expected Salary' in INR (e.g., '₹4,00,000 - ₹5,00,000') based STRICTLY on the candidate's extracted 'experience', 'skills', and 'educations'. For a fresher with basic skills, suggest ₹2,50,000 - ₹3,50,000. For an experienced CA/SAP expert, suggest market-standard higher brackets.

      STRICT JSON FORMAT:
      {
        "fullName": "Name in Title Case",
        "dob": "Date of birth if mentioned, else ''",
        "gender": "Male / Female / Other / ''",
        "phone": "Phone number",
        "email": "Email address",
        "panCard": "PAN number or ''",
        "bio": "Professional 2-line summary generated from resume",
        "city": "Current City",
        "state": "Current State",
        "pincode": "Pincode if mentioned",
        "preferredLocations": ["List of preferred cities or 'Remote'"],
        "educations": [
          {
            "qualification": "Choose closest match: CA Final, CA Inter, CMA Final, CMA Inter, CS Professional, CS Executive, MBA, M.Com, B.Com, 12th, 10th",
            "collegeName": "Institution name",
            "passingYear": "Year or 'Pursuing'",
            "percentage": "Percentage or CGPA",
            "attempts": "Number of attempts (e.g., '1', '2', 'Multiple') or ''"
          }
        ],
        "skills": ["skill1", "skill2", "skill3"],
        "languages": [
          {
             "language": "Language name (e.g., English)",
             "proficiency": "Fluent / Native / Intermediate / Beginner"
          }
        ],
        "experience": "Choose EXACTLY ONE: Fresher, 0-1 Years, 1-3 Years, 3-5 Years, 5+ Years",
        "currentSalary": "Current CTC if mentioned",
        "expectedSalary": "Expected CTC if mentioned, OR AI-calculated realistic Indian market standard salary in INR (e.g. '₹6,00,000 - ₹8,00,000')"
      }

      Resume Text:
      ${resumeText}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", 
      temperature: 0, 
      response_format: { type: "json_object" } 
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "{}";
    const extractedData = JSON.parse(aiResponse);

    return NextResponse.json(extractedData);
  } catch (error: any) {
     return NextResponse.json({ error: "AI processing failed" }, { status: 500 });
  }
}