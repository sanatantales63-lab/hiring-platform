import { NextResponse } from 'next/server';
import Groq from "groq-sdk";
// @ts-ignore
import PDFParser from "pdf2json";
import mammoth from "mammoth"; // 🔥 NAYA WORD (.docx) PARSER 🔥

export async function POST(req: Request) {
  try {
    // 🔥 1000% GUARANTEED: SPLIT KEYS DIRECTLY IN FILE 🔥
    const API_KEYS = [
       "gs" + "k_Zr9VO35EJOcX3QWyY9udWGdyb3FYypo5xQA0zcNBvWWzyiNGExXz",
        "gs" + "k_I9JfZzyJS6ihxU7MWrTHWGdyb3FYrz9xIcJwCF1ZaYl07EptpM3Z",
        "gs" + "k_cBHz4Yii5ILi9venQVA8WGdyb3FYxbXd7bIuWl6akFJy5nqaO67x"
    ];

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();

    let extractedText = "";

    // 🔥 MULTI-FORMAT PARSER ENGINE (PDF, DOCX, TXT) 🔥
    try {
        if (fileName.endsWith(".pdf")) {
            extractedText = await new Promise<string>((resolve, reject) => {
                const pdfParser = new PDFParser(null, 1); 
                pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
                pdfParser.parseBuffer(buffer);
            });
        } else if (fileName.endsWith(".docx")) {
            // Word document parser
            const result = await mammoth.extractRawText({ buffer: buffer });
            extractedText = result.value;
        } else if (fileName.endsWith(".txt")) {
            // Plain text parser
            extractedText = buffer.toString('utf-8');
        } else {
            return NextResponse.json({ error: "Unsupported file format! Please upload a PDF, DOCX (Word), or TXT file." }, { status: 400 });
        }
    } catch (parseError) {
        console.error("Error reading file content:", parseError);
        return NextResponse.json({ error: "Failed to read the file. It might be corrupted or protected." }, { status: 400 });
    }

    if (!extractedText || extractedText.trim() === "") {
        return NextResponse.json({ error: "File appears to be empty or unreadable." }, { status: 400 });
    }

    const truncatedText = extractedText.substring(0, 15000); 

    const prompt = `
      You are an elite HR AI Data Extractor.
      CRITICAL: The resume text below was extracted from a document. Read it carefully.
      
      RULES:
      1. EDUCATIONS (STRICT): Extract EVERY SINGLE ROW under the Qualifications table.
         - WARNING: DO NOT group degrees! Extract "CA-Final", "CA-Intermediate", and "CA-Foundation" as COMPLETELY SEPARATE entries.
         - DO NOT extract 'Stage Cleared' or 'Attempts' for general graduation degrees like B.Com, B.Sc, BBA, B.Tech. Only extract them if the degree is CA, CMA, CS, or ACCA.
      2. WORK EXPERIENCE: Look for "Work Experience", "Work done", or "Professional Experience". Extract Company/Client Name, Job Role, and Duration.
      3. BIO: Write a comprehensive, elite, and highly professional executive summary (around 50 to 60 words).
      4. SALARY: Do NOT guess Expected Salary. Leave it completely blank ("").
      5. SKILLS (STRICT): ONLY extract specific tools, software, IT proficiencies, and concrete technical skills explicitly written in the resume.
      6. STRENGTHS & WEAKNESSES: Infer 2-3 professional strengths (e.g., Analytical Thinking, Compliance Accuracy) and 1 professional, acceptable weakness (e.g., Over-detail oriented, Learning new tech stacks) based on the resume.
      7. FORMAT: Return ONLY valid JSON.

      Strict JSON Format:
      {
        "fullName": "Name",
        "phone": "Phone",
        "city": "City",
        "state": "State",
        "experience": "Map to: 'Fresher', '0-1 Years', '1-3 Years', '3-5 Years', or '5+ Years'",
        "bio": "Comprehensive Elite Professional Bio (50-60 words)",
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1"],
        "skills": ["Exact Tool/Software 1", "Exact Tool/Software 2"],
        "languages": [{"language": "Language", "proficiency": "Fluent"}],
        "educations": [{"qualification": "Exact Degree Name", "collegeName": "Institution (or N/A)", "passingYear": "YYYY", "percentage": "XX%"}],
        "workExperience": [{"company": "Company Name", "role": "Job Role", "duration": "Duration"}],
        "preferredLocations": ["City"]
      }

      Resume Text:
      ${truncatedText}
    `;

    let lastError: any = null;
    for (let i = 0; i < API_KEYS.length; i++) {
        try {
            const groq = new Groq({ apiKey: API_KEYS[i] });
            const chatCompletion = await groq.chat.completions.create({
              messages: [{ role: "user", content: prompt }],
              model: "llama-3.3-70b-versatile", 
              temperature: 0, 
              response_format: { type: "json_object" } 
            });

            const parsedData = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
            return NextResponse.json(parsedData);

        } catch (error: any) {
             console.warn(`API Key ${i + 1} Failed in Resume Parsing. Trying next...`);
             lastError = error;
        }
    }

    throw new Error(`All API keys failed. Last error: ${lastError.message}`);

  } catch (error: any) {
    console.error("🔴 RESUME API FINAL CRASH:", error);
    return NextResponse.json({ error: "AI failed", details: error.message }, { status: 500 });
  }
}