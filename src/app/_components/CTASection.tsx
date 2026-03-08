"use client";

import Image from "next/image";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import { useI18n } from "@/lib/i18n";

export default function CTASection() {
  const { t } = useI18n();

  return (
    <section className="bg-cream py-36 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        <div className="flex flex-wrap items-baseline justify-center gap-x-4">
          <SplitText
            text={t("cta.readyToFind")}
            className="text-5xl md:text-7xl font-extrabold text-dark-purple leading-tight"
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
          <SplitText
            text={t("cta.yourPath")}
            className="text-5xl md:text-7xl font-extrabold text-hot-pink leading-tight"
            delay={40}
            duration={1}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            textAlign="center"
            tag="span"
            onLetterAnimationComplete={() => {}}
          />
        </div>
        <p
          className="text-xl md:text-2xl text-dark-purple/70 max-w-2xl leading-relaxed"
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          {t("cta.description")}
        </p>
        <Link
          href="/preQuiz"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-linear-to-br from-girly-purple via-hot-pink to-cute-orange hover:from-cute-orange hover:via-hot-pink hover:to-girly-purple text-white font-bold text-2xl md:text-3xl transition-all duration-500 ease-in-out shadow-xl hover:shadow-2xl hover:scale-105"
        >
          {t("cta.startQuiz")}
          <Image
            src="/quiz-icon.svg"
            alt="quiz icon"
            width={28}
            height={28}
            className="object-contain"
          />
        </Link>
      </div>
    </section>
  );
}
