import Link from "next/link";
import { Sparkles } from "lucide-react";
import { formatDate } from "./types";

interface QuizCardProps {
  quizResult: {
    career: string;
    createdAt: string;
  } | null;
}

export default function QuizCard({ quizResult }: QuizCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
      <h3 className="text-sm font-bold text-girly-purple mb-3 font-heading">
        Career Quiz
      </h3>

      {quizResult ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-cute-orange shrink-0" />
            <span className="text-sm font-semibold text-dark-purple truncate">
              {quizResult.career}
            </span>
          </div>
          <p className="text-xs text-dark-purple/40 mb-3">
            Taken {formatDate(quizResult.createdAt)}
          </p>
          <Link
            href="/quiz/result"
            className="text-sm text-girly-purple font-medium hover:underline transition"
          >
            View results →
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-xs text-dark-purple/40 mb-3">
            Discover your ideal STEM career path!
          </p>
          <Link
            href="/preQuiz"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
              bg-linear-to-r from-hot-pink to-cute-orange
              text-white text-sm font-semibold
              hover:brightness-110 transition-all duration-300"
          >
            <Sparkles size={14} />
            Take the Quiz
          </Link>
        </div>
      )}
    </div>
  );
}
