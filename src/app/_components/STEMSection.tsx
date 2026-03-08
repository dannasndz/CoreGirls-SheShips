"use client";

import Image from "next/image";
import SplitText from "@/components/SplitText";
import { useI18n } from "@/lib/i18n";

export default function STEMSection() {
  const { t } = useI18n();

  const stemCards = [
    {
      letter: "S",
      word: t("stem.science.word"),
      img: "/science-card.png",
      letterColor: "text-white",
      wordColor: "text-white",
      titleColor: "text-girly-purple",
      stat: t("stem.science.stat"),
      definition: t("stem.science.definition"),
    },
    {
      letter: "T",
      word: t("stem.technology.word"),
      img: "/tech-card.png",
      letterColor: "text-white",
      wordColor: "text-white",
      titleColor: "text-hot-pink",
      stat: t("stem.technology.stat"),
      definition: t("stem.technology.definition"),
    },
    {
      letter: "E",
      word: t("stem.engineering.word"),
      img: "/engineer-card.png",
      letterColor: "text-white",
      wordColor: "text-white",
      titleColor: "text-cute-orange",
      stat: t("stem.engineering.stat"),
      definition: t("stem.engineering.definition"),
    },
    {
      letter: "M",
      word: t("stem.mathematics.word"),
      img: "/math-card.png",
      letterColor: "text-white",
      wordColor: "text-white",
      titleColor: "text-light-pink",
      stat: t("stem.mathematics.stat"),
      definition: t("stem.mathematics.definition"),
    },
  ];

  return (
    <section
      className="relative w-full py-18 px-6 md:px-16 lg:px-24 md:py-24 md:min-h-[calc(80vh-60px)] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/background-pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-girly-purple/60" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-8xl">
        <div className="text-center mb-14">
          <SplitText
            text={t("stem.heading")}
            className="text-6xl md:text-7xl font-extrabold text-white text-shadow-lg"
            delay={40}
            duration={1}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            textAlign="center"
            tag="h2"
            onLetterAnimationComplete={() => {}}
          />
          <p
            className="text-2xl md:text-3xl text-white/80 mt-3 bg-strong-purple/50 px-4 py-2 rounded-full inline-block shadow-sm"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            {t("stem.subheading")}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10 w-full max-w-8xl">
          {stemCards.map(
            ({
              letter,
              word,
              img,
              letterColor,
              wordColor,
              titleColor,
              stat,
              definition,
            }) => (
              <div
                key={word}
                className="group relative h-72 md:h-96 lg:h-136 rounded-4xl overflow-hidden border-10 border-white shadow-xl flex flex-col items-center justify-center gap-3 py-6 cursor-pointer"
              >
                <Image
                  src={img}
                  alt={word}
                  fill
                  className="object-cover object-top scale-105 brightness-75 transition-all duration-500 group-hover:opacity-0 blur-xs"
                />

                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span
                  className={`relative z-10 text-8xl md:text-9xl font-extrabold drop-shadow-lg leading-none transition-all duration-500 group-hover:opacity-0 group-hover:scale-90 ${letterColor}`}
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {letter}
                </span>
                <span
                  className={`relative z-10 text-base md:text-2xl font-bold drop-shadow-md transition-all duration-500 group-hover:opacity-0 ${wordColor}`}
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {word}
                </span>

                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span
                    className={`text-2xl md:text-4xl font-extrabold ${titleColor}`}
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {word}
                  </span>
                  <p
                    className="text-xs md:text-sm font-bold text-dark-purple/70 text-center uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-baloo)" }}
                  >
                    {stat}
                  </p>
                  <p
                    className="text-sm md:text-base text-dark-purple text-center leading-relaxed"
                    style={{ fontFamily: "var(--font-baloo)" }}
                  >
                    {definition}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
