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
    
    // 🔥 TUMHARI GROQ API KEY YAHAN HAI
    const groq = new Groq({ apiKey: "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" });

    // 🧠 THE STRICT AI PROMPT (Accuracy = 100%)
    const prompt = `
      You are a highly strict and accurate HR data extractor. Read the provided resume text and extract the details strictly in the JSON format below.
      
      CRITICAL RULES:
      1. DO NOT HALLUCINATE OR GUESS. If information is missing, leave the field as an empty string "" or empty array [].
      2. 'bio': Write a highly professional, impressive 2-line summary based ONLY on the candidate's actual skills and experience mentioned.
      3. 'panCard': Extract PAN number (Format: 5 letters, 4 numbers, 1 letter) only if explicitly mentioned.
      4. 'educations': Extract ALL qualifications. If they are CA/CMA/CS, look carefully for "Attempts" (e.g., "1st attempt", "Multiple").
      5. 'skills': Extract all technical and soft skills.
      6. 'currentSalary' & 'expectedSalary': Extract only if mentioned, otherwise leave empty.
      
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
        "expectedSalary": "Expected CTC if mentioned"
      }

      Resume Text:
      ${resumeText}
    `;

    // Temperature 0 means Maximum Strictness and No Hallucinations
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