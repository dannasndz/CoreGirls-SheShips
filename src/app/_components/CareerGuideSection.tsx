"use client";

import Image from "next/image";
import SplitText from "@/components/SplitText";
import { useI18n } from "@/lib/i18n";

export default function CareerGuideSection() {
  const { t } = useI18n();

  return (
    <section className="bg-cream py-36 px-6 md:px-16 lg:px-24">
      <div className="text-center mb-12">
        <SplitText
          text={t("careerGuide.heading")}
          className="text-6xl md:text-7xl font-extrabold text-dark-purple"
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
          className="text-3xl md:text-4xl text-dark-purple mt-2"
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          {t("careerGuide.subheading")}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center max-w-xs gap-4">
          <div>
            <Image
              src="/1pink.png"
              alt={t("careerGuide.step1Title")}
              width={184}
              height={184}
              className="object-contain"
            />
          </div>
          <div>
            <h3
              className="text-3xl font-extrabold text-hot-pink leading-tight"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {t("careerGuide.step1Title")}
            </h3>
            <p
              className="text-lg text-dark-purple mt-1 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              {t("careerGuide.step1Text")}{" "}
              <span className="text-hot-pink font-semibold">
                {t("careerGuide.step1Highlight")}
              </span>
            </p>
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="hidden md:flex items-center px-4 mb-20">
          <Image
            src="/Arrow 1.svg"
            alt="arrow"
            width={80}
            height={24}
            className="object-contain"
          />
        </div>
        <div className="flex md:hidden items-center rotate-90 my-2">
          <Image
            src="/Arrow 1.svg"
            alt="arrow"
            width={60}
            height={18}
            className="object-contain"
          />
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center max-w-xs gap-4">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-linear-to-br from-strong-purple to-girly-purple flex items-center justify-center shadow-lg">
            <Image
              src="/2purple.png"
              alt={t("careerGuide.step2Title")}
              width={184}
              height={184}
              className="object-contain"
            />
          </div>
          <div>
            <h3
              className="text-3xl font-extrabold text-girly-purple leading-tight"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {t("careerGuide.step2Title")}
            </h3>
            <p
              className="text-lg text-dark-purple mt-1 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              {t("careerGuide.step2Text")}{" "}
              <span className="text-girly-purple">
                {t("careerGuide.step2Highlight")}
              </span>
            </p>
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="hidden md:flex items-center px-4 mb-20">
          <Image
            src="/Arrow 2.svg"
            alt="arrow"
            width={80}
            height={24}
            className="object-contain"
          />
        </div>
        <div className="flex md:hidden items-center rotate-90 my-2">
          <Image
            src="/Arrow 2.svg"
            alt="arrow"
            width={60}
            height={18}
            className="object-contain"
          />
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center max-w-xs gap-4">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-linear-to-br from-cute-orange to-hot-pink flex items-center justify-center shadow-lg">
            <Image
              src="/3orange.png"
              alt="Women in STEM"
              width={184}
              height={184}
              className="object-contain"
            />
          </div>
          <div>
            <h3
              className="text-3xl font-extrabold text-cute-orange leading-tight"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {t("careerGuide.step3Title")}
            </h3>
            <p
              className="text-lg text-dark-purple mt-1 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              {t("careerGuide.step3Text")}{" "}
              <span className="text-cute-orange">
                {t("careerGuide.step3Highlight")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
