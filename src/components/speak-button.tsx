"use client";

import { useState, useRef, useCallback } from "react";
import { Volume2, Loader2, Square } from "lucide-react";

// In-memory cache: text → blob URL (skip network on repeated clicks)
const audioCache = new Map<string, string>();

interface SpeakButtonProps {
  text: string;
  size?: "sm" | "md";
  className?: string;
}

export function SpeakButton({ text, size = "sm", className = "" }: SpeakButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState("idle");
  }, []);

  const speak = useCallback(async () => {
    if (state === "playing" || state === "loading") {
      stop();
      return;
    }

    setState("loading");

    try {
      // If cached, play immediately
      const cached = audioCache.get(text);
      if (cached) {
        const audio = new Audio(cached);
        audioRef.current = audio;
        audio.onended = () => { audioRef.current = null; setState("idle"); };
        audio.onerror = () => { audioRef.current = null; setState("idle"); };
        setState("playing");
        await audio.play();
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error("TTS request failed");

      // Stream into a MediaSource so audio starts playing on first chunk
      const mediaSource = new MediaSource();
      const audioUrl = URL.createObjectURL(mediaSource);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      mediaSource.addEventListener("sourceopen", async () => {
        const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
        const reader = res.body!.getReader();
        const chunks: Uint8Array[] = [];

        let started = false;

        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              // Wait for any pending appends before closing
              if (sourceBuffer.updating) {
                await new Promise<void>((r) =>
                  sourceBuffer.addEventListener("updateend", () => r(), { once: true })
                );
              }
              if (mediaSource.readyState === "open") {
                mediaSource.endOfStream();
              }
              // Cache the full audio as a blob for future plays
              const fullBlob = new Blob(chunks as BlobPart[], { type: "audio/mpeg" });
              audioCache.set(text, URL.createObjectURL(fullBlob));
              return;
            }

            chunks.push(value);

            // Wait if the buffer is still processing the previous chunk
            if (sourceBuffer.updating) {
              await new Promise<void>((r) =>
                sourceBuffer.addEventListener("updateend", () => r(), { once: true })
              );
            }

            sourceBuffer.appendBuffer(value);

            // Start playback as soon as we have the first chunk
            if (!started) {
              started = true;
              setState("playing");
              audio.play().catch(() => {});
            }
          }
        };

        pump().catch(() => {});
      });

      audio.onended = () => {
        audioRef.current = null;
        setState("idle");
      };

      audio.onerror = () => {
        audioRef.current = null;
        setState("idle");
      };
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setState("idle");
    }
  }, [text, state, stop]);

  const iconSize = size === "sm" ? 14 : 18;
  const padding = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        speak();
      }}
      className={`${padding} rounded-full transition-colors shrink-0 ${
        state === "playing"
          ? "bg-hot-pink/20 text-hot-pink"
          : "bg-girly-purple/10 text-girly-purple hover:bg-girly-purple/20"
      } ${className}`}
      aria-label={state === "playing" ? "Stop reading" : "Read aloud"}
      title={state === "playing" ? "Stop" : "Read aloud"}
    >
      {state === "loading" ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : state === "playing" ? (
        <Square size={iconSize} fill="currentColor" />
      ) : (
        <Volume2 size={iconSize} />
      )}
    </button>
  );
}
