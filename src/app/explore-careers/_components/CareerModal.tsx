"use client";

import { Career, categoryLabels as categoryLabelsEn } from "@/data/careers";
import { categoryLabelsEs } from "@/data/careers.es";
import { roleModels as roleModelsEn } from "@/data/roleModels";
import { roleModelsEs } from "@/data/roleModels.es";
import Image from "next/image";
import { Linkedin, Flame, BookOpen, Link2, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const getCareerImage = (id: string) => {
  if (id === "database-administrator") return "/careers/database-administrato.png";
  return `/careers/${id}.png`;
};

type CareerModalProps = {
  career: Career;
  onClose: () => void;
};

const categoryLabelsMap = { en: categoryLabelsEn, es: categoryLabelsEs } as const;
const roleModelsMap = { en: roleModelsEn, es: roleModelsEs } as const;

export default function CareerModal({ career, onClose }: CareerModalProps) {
  const { t, locale } = useI18n();
  const categoryLabels = categoryLabelsMap[locale];
  const roleModels = roleModelsMap[locale];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-purple/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl [scrollbar-width:thin] [scrollbar-color:rgba(168,85,247,0.2)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-6 [&::-webkit-scrollbar-thumb]:bg-girly-purple/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-girly-purple/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div
          className="rounded-t-3xl p-8 relative h-48 md:h-56 overflow-hidden"
        >
          <Image
            src={getCareerImage(career.id)}
            alt={career.name}
            fill
            className="object-cover blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-dark-purple font-bold transition-colors"
          >
            ✕
          </button>

          <div className="absolute bottom-6 left-8 right-8 z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/80 text-dark-purple text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                {categoryLabels[career.category]}
              </span>
              {career.growth && (
                <span className="bg-linear-to-br from-cute-orange/60 to-hot-pink/60 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <Flame size={12} />
                  {t("exploreCareers.growth")}
                </span>
              )}
            </div>

            <h2
              className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {career.name}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col gap-6">
          {/* Description */}
          <div>
            <p
              className="text-base text-dark-purple/80 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              {career.description}
            </p>
          </div>

          {/* What to study */}
          <div>
            <h3
              className="text-xl font-extrabold text-dark-purple mb-3 inline-flex items-center gap-2"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <BookOpen size={20} className="text-girly-purple" />
              {t("exploreCareers.whatToStudy")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.studyPaths.map((path) => (
                <span
                  key={path}
                  className="bg-girly-purple/10 text-girly-purple text-sm font-semibold px-4 py-2 rounded-full"
                  style={{ fontFamily: "var(--font-baloo)" }}
                >
                  {path}
                </span>
              ))}
            </div>
          </div>

          {/* Related careers */}
          <div>
            <h3
              className="text-xl font-extrabold text-dark-purple mb-3 inline-flex items-center gap-2"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <Link2 size={20} className="text-hot-pink" />
              {t("exploreCareers.relatedCareers")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.relatedCareers.map((related) => (
                <span
                  key={related}
                  className="bg-hot-pink/10 text-hot-pink text-sm font-semibold px-4 py-2 rounded-full"
                  style={{ fontFamily: "var(--font-baloo)" }}
                >
                  {related}
                </span>
              ))}
            </div>
          </div>

          {/* Role Models in this field */}
          <div>
            <h3
              className="text-xl font-extrabold text-dark-purple mb-3 inline-flex items-center gap-2"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <Star size={20} className="text-cute-orange" />
              {t("exploreCareers.womenLeading")}
            </h3>
            <div className="flex flex-col gap-3">
              {roleModels
                .filter((rm) => rm.category === career.category)
                .slice(0, 4)
                .map((rm) => (
                  <div
                    key={rm.id}
                    className="flex items-center gap-3 bg-cream rounded-2xl px-4 py-3"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={rm.photo}
                        alt={rm.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold text-dark-purple text-sm leading-tight"
                        style={{ fontFamily: "var(--font-fredoka)" }}
                      >
                        {rm.name}
                      </p>
                      <p
                        className="text-dark-purple/50 text-xs truncate"
                        style={{ fontFamily: "var(--font-baloo)" }}
                      >
                        {rm.field} · {rm.country}
                      </p>
                    </div>
                    {rm.linkedin && (
                      <a
                        href={rm.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cute-orange hover:text-hot-pink transition-colors shrink-0"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
