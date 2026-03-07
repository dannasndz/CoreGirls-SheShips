"use client";

import Image from "next/image";
import SplitText from "@/components/SplitText";

const stemCards = [
  {
    letter: "S",
    word: "Science",
    img: "/science-card.png",
    letterColor: "text-white",
    wordColor: "text-white",
    titleColor: "text-girly-purple",
    stat: "Only 33% of researchers worldwide are women.",
    definition:
      "From Nobel laureate Marie Curie to ecologist Sandra Díaz, women in science are rewriting the rules. Your curiosity could lead the next breakthrough.",
  },
  {
    letter: "T",
    word: "Technology",
    img: "/tech-card.png",
    letterColor: "text-white",
    wordColor: "text-white",
    titleColor: "text-hot-pink",
    stat: "Just 26% of tech professionals are women.",
    definition:
      "Grace Hopper invented the first compiler, and today Latina engineers lead innovation at top companies worldwide. Your ideas belong here.",
  },
  {
    letter: "E",
    word: "Engineering",
    img: "/engineer-card.png",
    letterColor: "text-white",
    wordColor: "text-white",
    titleColor: "text-cute-orange",
    stat: "Less than 15% of engineers globally are women.",
    definition:
      "From bridges to biomedical devices, women engineers solve the world's toughest challenges. Creativity + logic is your superpower.",
  },
  {
    letter: "M",
    word: "Mathematics",
    img: "/math-card.png",
    letterColor: "text-white",
    wordColor: "text-white",
    titleColor: "text-light-pink",
    stat: "Maryam Mirzakhani was the first woman to win the Fields Medal.",
    definition:
      "Math is the foundation of every STEM field and opens every door. From data science to cryptography — let it open yours.",
  },
];

export default function STEMSection() {
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
            text="The Future of STEM Needs You"
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
            Women are underrepresented in every STEM field. You can change that.
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
