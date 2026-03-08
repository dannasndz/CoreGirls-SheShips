import Link from "next/link";
import { ParticleCard } from "@/components/MagicBento";
import { Sparkles } from "lucide-react";
import { formatDate, GLOW_COLOR, cardStyle, cardClass } from "./types";

interface QuizCardProps {
  quizResult: {
    career: string;
    createdAt: string;
  } | null;
}

export default function QuizCard({ quizResult }: QuizCardProps) {
  return (
    <ParticleCard
      className={cardClass}
      style={cardStyle}
      glowColor={GLOW_COLOR}
      enableTilt={false}
      clickEffect
      particleCount={6}
    >
      <div className="p-2 flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 text-white text-s mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Career Quiz</span>
        </div>
        {quizResult ? (
          <>
            <p className="text-2xl font-bold text-cute-orange font-[family-name:var(--font-fredoka)] leading-tight">
              {quizResult.career}
            </p>
            <p className="text-white text-s mt-2">
              Taken {formatDate(quizResult.createdAt)}
            </p>
          </>
        ) : (
          <div className="flex flex-col items-start gap-2">
            <p className="text-white/80 text-sm">
              Discover your ideal career path!
            </p>
            <Link
              href="/preQuiz"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-hot-pink to-cute-orange text-white text-sm font-semibold hover:brightness-110 transition-all duration-300"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Take the Quiz
            </Link>
          </div>
        )}
      </div>
    </ParticleCard>
  );
}
