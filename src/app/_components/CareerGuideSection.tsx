"use client";

import Image from "next/image";
import SplitText from "@/components/SplitText";

export default function CareerGuideSection() {
  return (
    <section className="bg-cream py-36 px-6 md:px-16 lg:px-24">
      <div className="text-center mb-12">
        <SplitText
          text="Your Journey Starts Here"
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
          three simple steps to find your STEM path
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center max-w-xs gap-4">
          <div>
            <Image
              src="/1pink.png"
              alt="Answer the Quiz"
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
              Answer the Quiz
            </h3>
            <p
              className="text-lg text-dark-purple mt-1 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              Take our fun, 7-stage quiz designed just for you.{" "}
              <span className="text-hot-pink font-semibold">
                No pressure, no right or wrong answers — just discover what
                excites you.
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
              alt="Discover your Path"
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
              Discover your Path
            </h3>
            <p
              className="text-lg text-dark-purple mt-1 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              Get a personalized STEM profile based on your unique answers.{" "}
              <span className="text-girly-purple">
                Learn what the career looks like, what you&apos;d be doing, and
                why you&apos;re the perfect match.
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
              Meet Your Role Models
            </h3>
            <p
              className="text-lg text-dark-purple mt-1 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              Connect with real women thriving in STEM.{" "}
              <span className="text-cute-orange">
                Read their stories, learn from their journeys, and see yourself
                in their success.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
