import { GoogleGenerativeAI } from "@google/generative-ai";

export type RoastIntensity = "light" | "medium" | "dark" | "espresso" | "charcoal";

const INTENSITY_PROMPTS: Record<RoastIntensity, string> = {
  light:    "Be gentle and constructive. Point out issues softly. Like a kind mentor reviewing a student's first attempt.",
  medium:   "Be honest and direct. Don't sugarcoat but stay professional. Like a senior dev in a code review.",
  dark:     "Be blunt and a bit brutal. Call out every flaw clearly. Like Gordon Ramsay reviewing their portfolio.",
  espresso: "Be savage. Mock the choices. Make them question their life decisions but still give real advice.",
  charcoal: "DESTROY it. Absolutely obliterate every design and content choice. Be a roast comedian who also happens to be a world-class UX expert. No mercy. But still technically accurate."
};

export interface RoastResult {
  overallScore:   number;
  tagline:        string;
  roastParagraph: string;
  categories: {
    design:       number;
    content:      number;
    ux:           number;
    originality:  number;
    presentation: number;
    impact:       number;
  };
  fixes: string[];
  verdict: string;
}

export async function generateRoast(
  content: string,
  intensity: RoastIntensity,
  inputType: "url" | "pdf" | "text"
): Promise<RoastResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key not configured.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
You are CrispCV — the world's most brutally honest portfolio and resume reviewer.
Intensity level: ${intensity.toUpperCase()} — ${INTENSITY_PROMPTS[intensity]}

Input type: ${inputType === "url" ? "Portfolio website" : inputType === "pdf" ? "Resume PDF" : "Resume text"}

CONTENT TO ROAST:
${content}

Respond ONLY with a valid JSON object (no markdown, no backticks) in this exact shape:
{
  "overallScore": <integer 1-10>,
  "tagline": "<one punchy roast sentence under 12 words>",
  "roastParagraph": "<3-5 sentence roast at the chosen intensity>",
  "categories": {
    "design":       <integer 1-10>,
    "content":      <integer 1-10>,
    "ux":           <integer 1-10>,
    "originality":  <integer 1-10>,
    "presentation": <integer 1-10>,
    "impact":       <integer 1-10>
  },
  "fixes": ["<fix 1>", "<fix 2>", "<fix 3>"],
  "verdict": "<one-word brutal verdict e.g. CREMATED / SINGED / SURVIVED>"
}
`.trim();

  const result = await model.generateContent(prompt);
  const text   = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text) as RoastResult;
}
