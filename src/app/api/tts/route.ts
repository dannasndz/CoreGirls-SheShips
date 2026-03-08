import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Pre-made voice "Sarah" — warm, friendly, works well for quiz questions
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.length > 2500) {
      return NextResponse.json(
        { error: "Text is required and must be under 2500 characters" },
        { status: 400 }
      );
    }

    const audioStream = await elevenlabs.textToSpeech.convert(VOICE_ID, {
      text,
      modelId: "eleven_flash_v2_5",
    });

    // audioStream is a ReadableStream — pipe it directly into the response
    return new NextResponse(audioStream as ReadableStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
