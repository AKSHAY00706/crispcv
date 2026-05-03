import Groq from "groq-sdk";

export type RoastIntensity = "light" | "medium" | "dark" | "espresso" | "charcoal";

const INTENSITY_PROMPTS: Record<RoastIntensity, string> = {
  light:    "Be gentle and constructive. Like a kind mentor reviewing a first attempt.",
  medium:   "Be honest and direct. Like a senior dev doing a real code review.",
  dark:     "Be blunt and brutal. Call out every flaw. Like Gordon Ramsay reviewing their portfolio.",
  espresso: "Be savage. Mock every choice. Make them question their life decisions but give real advice.",
  charcoal: "DESTROY it. Obliterate every design and content choice. Be a roast comedian who is also a world-class UX expert. No mercy. Stay technically accurate.",
};

export interface CategoryBreakdown {
  score: number;
  whatIsWrong: string;
}

export interface RoastResult {
  overallScore: number;
  tagline: string;
  roastParagraph: string;
  categories: {
    design: CategoryBreakdown;
    content: CategoryBreakdown;
    ux: CategoryBreakdown;
    originality: CategoryBreakdown;
    presentation: CategoryBreakdown;
    impact: CategoryBreakdown;
  };
  fixes: string[];
  verdict: string;
}

export async function generateRoast(
  content: string,
  intensity: RoastIntensity,
  inputType: "url" | "pdf" | "text"
): Promise<RoastResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY in environment variables");
  }

  const groq = new Groq({ apiKey });

  const prompt = [
    "You are CrispCV — the world's most brutally honest portfolio and resume reviewer.",
    "Intensity: " + intensity.toUpperCase() + " — " + INTENSITY_PROMPTS[intensity],
    "Input type: " + (inputType === "url" ? "Portfolio website" : "Resume"),
    "",
    "CONTENT:",
    content.slice(0, 6000),
    "",
    "STRICT RULES:",
    "1. fixes array: minimum 5 items. If overallScore <= 4, include 6 items. If overallScore <= 2, include 7 items.",
    "2. First 2 fixes = HIGH priority. Next 2 = MED priority. Rest = NICE TO HAVE.",
    "3. Each fix must be specific and actionable.",
    "4. Each category 'whatIsWrong' must be one sharp sentence.",
    "5. verdict must be one of: CREMATED / DESTROYED / ROASTED / SINGED / SURVIVED / PASSABLE",
    "",
    "Respond ONLY with raw JSON:",
    "{",
    '  "overallScore": <1-10>,',
    '  "tagline": "<short roast>",',
    '  "roastParagraph": "<3-5 sentences>",',
    '  "categories": {',
    '    "design": { "score": <1-10>, "whatIsWrong": "" },',
    '    "content": { "score": <1-10>, "whatIsWrong": "" },',
    '    "ux": { "score": <1-10>, "whatIsWrong": "" },',
    '    "originality": { "score": <1-10>, "whatIsWrong": "" },',
    '    "presentation": { "score": <1-10>, "whatIsWrong": "" },',
    '    "impact": { "score": <1-10>, "whatIsWrong": "" }',
    "  },",
    '  "fixes": ["", "", "", "", ""],',
    '  "verdict": ""',
    "}",
  ].join("\n");

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.85,
    max_tokens: 2000,
  });

  const raw = completion.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("Empty response from AI");
  }

  const clean = raw.replace(/```json|```/g, "").trim();

  let parsed: any;

  try {
    parsed = JSON.parse(clean);
  } catch (err) {
    console.error("RAW AI RESPONSE:", raw);
    throw new Error("AI returned invalid JSON");
  }

  // Normalize category format
  const keys = ["design","content","ux","originality","presentation","impact"] as const;

  for (const k of keys) {
    const val = parsed.categories?.[k];
    if (typeof val === "number") {
      parsed.categories[k] = {
        score: val,
        whatIsWrong: "No breakdown provided",
      };
    }
  }

  // Clamp score
  parsed.overallScore = Math.min(10, Math.max(1, parsed.overallScore));

  return parsed as RoastResult;
}