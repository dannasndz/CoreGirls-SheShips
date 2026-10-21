"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  EXPO_SATISFACCION_MAX,
  EXPO_SATISFACCION_MIN,
} from "@/lib/expo-feedback";

interface SatisfactionCardProps {
  submissionId: string;
  onDone: () => void;
}

const RATINGS = Array.from(
  { length: EXPO_SATISFACCION_MAX - EXPO_SATISFACCION_MIN + 1 },
  (_, i) => EXPO_SATISFACCION_MIN + i
);

export function SatisfactionCard({
  submissionId,
  onDone,
}: SatisfactionCardProps) {
  const { t } = useI18n();
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (rating === null || submitting || done) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/expo/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, satisfaccion: rating }),
      });

      if (!res.ok) {
        setError(t("expo.satisfactionError"));
        return;
      }

      setDone(true);
      setTimeout(onDone, 1400);
    } catch {
      setError(t("expo.satisfactionError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream px-6 py-10 sm:px-10 md:px-16">
      <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-[#E5E0D9] shadow-sm p-6 sm:p-8">
        {done ? (
          <div className="flex flex-col items-center text-center gap-2 py-4">
            <Sparkles className="text-girly-purple" size={30} />
            <p className="text-lg font-bold text-dark-purple font-[family-name:var(--font-fredoka)]">
              {t("expo.satisfactionThanks")}
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-extrabold text-dark-purple font-heading mb-1">
              {t("expo.satisfactionTitle")}
            </h3>
            <p className="text-sm text-dark-purple/60 mb-5">
              {t("expo.satisfactionQuestion")}
            </p>

            <div className="flex items-center justify-between gap-2 mb-2">
              {RATINGS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-pressed={rating === value}
                  className={`flex-1 h-12 rounded-xl text-lg font-bold transition ${
                    rating === value
                      ? "bg-girly-purple text-white shadow-md"
                      : "bg-girly-purple/10 text-strong-purple hover:bg-girly-purple/20"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-[11px] text-dark-purple/50 mb-5">
              <span>{t("expo.satisfactionMin")}</span>
              <span>{t("expo.satisfactionMax")}</span>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium mb-3">{error}</p>
            )}

            {rating === null && (
              <p className="text-xs text-dark-purple/40 mb-3">
                {t("expo.satisfactionRequired")}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={rating === null || submitting}
              className="w-full sm:w-auto sm:px-8 rounded-full bg-girly-purple text-white font-semibold py-2.5 hover:bg-strong-purple transition disabled:opacity-40 disabled:pointer-events-none"
            >
              {submitting
                ? t("expo.satisfactionSending")
                : t("expo.satisfactionSubmit")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
