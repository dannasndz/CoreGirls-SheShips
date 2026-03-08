"use client";

import { Career, categoryLabels } from "@/data/careers";
import Image from "next/image";

const getCareerImage = (id: string) => {
  if (id === "database-administrator") return "/careers/database-administrato.png";
  return `/careers/${id}.png`;
};

type CareerModalProps = {
  career: Career;
  onClose: () => void;
};

export default function CareerModal({ career, onClose }: CareerModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
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
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />

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
                <span className="bg-white/80 text-cute-orange text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  🔥 Trending Career
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
              className="text-xl font-extrabold text-dark-purple mb-3"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              📚 What to Study
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
              className="text-xl font-extrabold text-dark-purple mb-3"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              🔗 Related Careers
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

          {/* Leaders */}
          <div>
            <h3
              className="text-xl font-extrabold text-dark-purple mb-3"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              ⭐ Leaders in This Field
            </h3>
            <div className="flex flex-col gap-2">
              {career.leaders.map((leader) => (
                <div
                  key={leader.name}
                  className="flex items-center gap-3 bg-cream rounded-2xl px-4 py-3"
                >
                  <div className="w-10 h-10 rounded-full bg-cute-orange/20 flex items-center justify-center text-lg">
                    👩‍🔬
                  </div>
                  <div>
                    <p
                      className="font-bold text-dark-purple text-sm"
                      style={{ fontFamily: "var(--font-fredoka)" }}
                    >
                      {leader.name}
                    </p>
                    <p
                      className="text-dark-purple/60 text-xs"
                      style={{ fontFamily: "var(--font-baloo)" }}
                    >
                      {leader.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
