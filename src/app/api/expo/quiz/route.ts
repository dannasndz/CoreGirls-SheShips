export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { careers as careersEn } from "@/data/careers";
import { careersEs } from "@/data/careers.es";
import { validateExpoDemographics } from "@/lib/expo-validation";
import { buildExpoRow } from "@/lib/expo-payload";
import { normalizeAnswers, pickCareer } from "@/lib/quiz-scoring";

const careersMap = { en: careersEn, es: careersEs } as const;

async function postToSheet(payload: unknown): Promise<boolean> {
  const url = process.env.EXPO_SHEETS_WEBAPP_URL;
  if (!url) {
    console.error("EXPO_SHEETS_WEBAPP_URL is not configured");
    return false;
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
        cache: "no-store",
      });
      if (res.ok) return true;
    } catch (err) {
      console.error(`POST expo sheet attempt ${attempt + 1} failed:`, err);
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, demographics, answers, locale } = body ?? {};

    if (typeof submissionId !== "string" || !submissionId.trim()) {
      return NextResponse.json(
        { data: null, error: "submissionId is required" },
        { status: 400 }
      );
    }
    if (submissionId.length > 100) {
      return NextResponse.json(
        { data: null, error: "Invalid submissionId" },
        { status: 400 }
      );
    }

    const demographicsResult = validateExpoDemographics(demographics ?? {});
    if (!demographicsResult.ok) {
      return NextResponse.json(
        { data: null, error: demographicsResult.message },
        { status: 400 }
      );
    }

    const normalizedAnswers = normalizeAnswers(answers);
    if (!normalizedAnswers) {
      return NextResponse.json(
        { data: null, error: "Invalid answers" },
        { status: 400 }
      );
    }

    const lang = locale === "en" ? "en" : "es";
    const { career, score, topType } = pickCareer(
      normalizedAnswers,
      careersMap[lang]
    );

    const row = buildExpoRow({
      submissionId,
      demographics: demographicsResult.data,
      score,
      topType,
      careerId: career.id,
      locale: lang,
    });

    const saved = await postToSheet({
      secret: process.env.EXPO_SHEETS_SECRET ?? "",
      row,
    });

    if (!saved) {
      return NextResponse.json(
        { data: null, error: "Could not save response" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      data: { ok: true, career: career.id, score, topType },
      error: null,
    });
  } catch (err) {
    console.error("POST /api/expo/quiz error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
