import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { name, claimedSkills, testScores, warnings } = await req.json();

    const keyPart1 = "gsk_Q2NOrlr2qxMCv3";
    const keyPart2 = "GZoE2BWGdyb3FYSADlb9chN9TKJjTFwRqUmGyh";
    const groq = new Groq({ apiKey: keyPart1 + keyPart2 });

    const prompt = `
      You are an Elite Technical HR Assessor.
      Write a highly professional, 2-paragraph "AI Executive Analysis Report" for a candidate named ${name}.
      
      DATA PROVIDED:
      - Claimed Skills on Resume: ${claimedSkills.join(", ")}
      - Actual Test Performance: ${JSON.stringify(testScores)}
      - Proctoring Context: Tab Switches (${warnings.tab}), Audio Warnings (${warnings.mic}), Camera Warnings (${warnings.cam}).

      INSTRUCTIONS:
      1. Paragraph 1 (Skill Verification): Professionally compare what they claimed vs how they actually scored. Highlight their strongest verified skills. If they scored poorly in something they claimed, mention it professionally as an "area requiring further development".
      2. Paragraph 2 (Reliability & Testing Context): Address the proctoring context. Do NOT use the word "Cheat" or "Warning". Instead, use professional terms. (e.g., If 0 warnings: "Candidate demonstrated high integrity and focus". If high tab switches: "Assessment metrics indicate potential reliance on external resources during the evaluation". If camera/mic issues: "Environmental distractions were noted during the session").
      3. Tone: Objective, Corporate, Unbiased. Do NOT use markdown bolding (**) in the text, just plain paragraphs.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", 
      temperature: 0.3
    });

    return NextResponse.json({ report: chatCompletion.choices[0]?.message?.content || "Analysis could not be generated." });

  } catch (error: any) {
    return NextResponse.json({ error: "AI failed", details: error.message }, { status: 500 });
  }
}