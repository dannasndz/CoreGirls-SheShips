export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { parseSatisfaccion } from "@/lib/expo-feedback";

interface SheetResult {
  ok: boolean;
  error?: string;
}

async function postFeedback(payload: unknown): Promise<SheetResult> {
  const url = process.env.EXPO_SHEETS_WEBAPP_URL;
  if (!url) {
    return { ok: false, error: "EXPO_SHEETS_WEBAPP_URL is not configured" };
  }

  let lastError = "Unknown error";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
        cache: "no-store",
      });

      const text = await res.text();
      let data: { ok?: boolean; error?: string } | null = null;
      try {
        data = JSON.parse(text);
      } catch {
        // Apps Script might return non-JSON on error.
      }

      if (res.ok && data?.ok === true) return { ok: true };

      lastError = data?.error ?? `HTTP ${res.status}`;
      console.error(
        `POST expo feedback attempt ${attempt + 1} rejected:`,
        lastError,
        text.slice(0, 200)
      );
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error(`POST expo feedback attempt ${attempt + 1} failed:`, err);
    }
  }

  return { ok: false, error: lastError };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, satisfaccion } = body ?? {};

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

    const rating = parseSatisfaccion(satisfaccion);
    if (rating === null) {
      return NextResponse.json(
        { data: null, error: "satisfaccion must be an integer from 1 to 5" },
        { status: 400 }
      );
    }

    const saved = await postFeedback({
      secret: process.env.EXPO_SHEETS_SECRET ?? "",
      action: "feedback",
      submissionId: submissionId.trim(),
      satisfaccion: rating,
    });

    if (!saved.ok) {
      return NextResponse.json(
        { data: null, error: "Could not save feedback" },
        { status: 502 }
      );
    }

    return NextResponse.json({ data: { ok: true }, error: null });
  } catch (err) {
    console.error("POST /api/expo/feedback error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
