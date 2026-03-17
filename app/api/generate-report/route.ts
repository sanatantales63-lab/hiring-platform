import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { name, claimedSkills, testScores, warnings } = await req.json();
    const keyPart1 = "gsk_Q2NOrlr2qxMCv3";
    const keyPart2 = "GZoE2BWGdyb3FYSADlb9chN9TKJjTFwRqUmGyh";
    const groq = new Groq({ apiKey: keyPart1 + keyPart2 });

    const prompt = `
      You are an Elite Technical HR & Behavioral Assessor.
      Write a highly professional, 3-paragraph "AI Executive Analysis Report" for a candidate named ${name}.

      DATA PROVIDED:
      - Claimed Skills on Resume: ${claimedSkills.join(", ")}
      - Actual Test Performance (Includes Tech & Psychometric fit): ${JSON.stringify(testScores)}
      - Proctoring Context: Tab Switches (${warnings.tab}), Audio Warnings (${warnings.mic}), Camera Warnings (${warnings.cam}).

      INSTRUCTIONS:
      1. Paragraph 1 (Technical Verification): Professionally compare their claimed skills vs actual tech scores. Highlight verified strengths.
      2. Paragraph 2 (Behavioral & Culture Fit): Analyze their score in "Psychometric & Behavioral Fit". Discuss their workplace ethics, decision-making, and culture fit potential based on this score.
      3. Paragraph 3 (Reliability & Context): Address the proctoring context. Do NOT use the word "Cheat" or "Warning". Use professional terms (e.g., "High integrity and focus" or "Environmental distractions noted").

      Tone: Objective, Corporate, Unbiased. Do NOT use markdown bolding (**). Just plain paragraphs separated by new lines.
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