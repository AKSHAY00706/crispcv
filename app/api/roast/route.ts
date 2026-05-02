import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit }  from "@/lib/rateLimiter";
import { isValidUrl, sanitiseText, validatePdfFile } from "@/lib/validators";
import { scrapePortfolio } from "@/lib/scraper";
import { generateRoast, RoastIntensity } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  // ── IP-based rate limiting ─────────────────────────────
  const ip    = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    const mins = Math.ceil(limit.resetInMs / 60_000);
    return NextResponse.json(
      { error: `Too many roasts. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.`, resetInMs: limit.resetInMs },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // ── Honeypot check (bot trap) ──────────────────────────
    if (body._trap) {
      return NextResponse.json({ error: "Nice try, bot." }, { status: 400 });
    }

    const { inputType, url, resumeText, intensity } = body;
    const validIntensities: RoastIntensity[] = ["light","medium","dark","espresso","charcoal"];

    if (!validIntensities.includes(intensity)) {
      return NextResponse.json({ error: "Invalid intensity level." }, { status: 400 });
    }

    let content = "";

    if (inputType === "url") {
      if (!url || !isValidUrl(url)) {
        return NextResponse.json({ error: "Please provide a valid portfolio URL (https://...)." }, { status: 400 });
      }
      content = await scrapePortfolio(url);

    } else if (inputType === "text") {
      if (!resumeText || resumeText.trim().length < 50) {
        return NextResponse.json({ error: "Resume text too short. Paste at least 50 characters." }, { status: 400 });
      }
      content = sanitiseText(resumeText);

    } else {
      return NextResponse.json({ error: "Invalid input type." }, { status: 400 });
    }

    const result = await generateRoast(content, intensity, inputType);

    return NextResponse.json(
      { result, remaining: limit.remaining },
      { status: 200, headers: {
        "X-RateLimit-Remaining": String(limit.remaining),
        "X-RateLimit-Reset":     String(limit.resetInMs)
      }}
    );

  } catch (err) {
    console.error("[roast/route]", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "Something went wrong. The roaster broke." },
      { status: 500 }
    );
  }
}
