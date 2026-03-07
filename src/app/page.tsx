import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 px-8 md:px-16 lg:px-24 py-10 md:py-0 md:min-h-[calc(100vh-60px)]">
        {/* Left: Slogan + Buttons */}
        <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/2">
          <Image
            src="/slogan.svg"
            alt="Meet the woman shaping our world, and join them"
            width={480}
            height={420}
            className="w-[85%] sm:w-[75%] md:w-full object-contain"
            priority
          />

          <div className="flex flex-row gap-4 flex-wrap justify-center md:justify-start">
            {/* Take the Quiz button */}
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-br from-girly-purple via-hot-pink to-cute-orange hover:from-cute-orange hover:via-hot-pink hover:to-girly-purple text-white font-semibold text-xl transition-all duration-500 ease-in-out shadow-md"
            >
              Take the Quiz
              <Image
                src="/quiz-icon.svg"
                alt="quiz icon"
                width={18}
                height={18}
                className="object-contain relative -top-0.5"
              />
            </Link>

            {/* Explore button */}
            <Link
              href="/explore-careers"
              className="inline-flex items-center px-6 py-3 rounded-full border-2 border-cute-orange text-cute-orange font-semibold text-xl hover:bg-cute-orange hover:text-white transition-all duration-300"
            >
              Explore
            </Link>
          </div>
        </div>

        {/* Right: Banner image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <Image
            src="/banner.png"
            alt="Women shaping the world"
            width={480}
            height={420}
            className="w-[85%] sm:w-[75%] md:w-full object-contain"
            priority
          />
        </div>
      </section>

      {/* STEM Section */}
      <section
        className="relative w-full py-24 px-6 md:px-16 lg:px-24 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/background-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Purple overlay */}
        <div className="absolute inset-0 bg-girly-purple/80" />

        {/* Cards grid */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10 w-full max-w-8xl">
          {[
            {
              letter: "S",
              word: "Science",
              img: "/science-background.png",
              letterColor: "text-white",
              wordColor: "text-white",
              titleColor: "text-girly-purple",
              definition:
                "Explore the natural world through observation, experimentation, and discovery. From biology to chemistry, science is everywhere.",
            },
            {
              letter: "T",
              word: "Technology",
              img: "/technology-background.png",
              letterColor: "text-white",
              wordColor: "text-white",
              titleColor: "text-hot-pink",
              definition:
                "Design and build the tools that shape our future. Technology drives innovation in every industry imaginable.",
            },
            {
              letter: "E",
              word: "Engineering",
              img: "/engineering-background.png",
              letterColor: "text-white",
              wordColor: "text-white",
              titleColor: "text-cute-orange",
              definition:
                "Solve real-world problems by combining creativity and math. Engineers design everything from bridges to robots.",
            },
            {
              letter: "M",
              word: "Mathematics",
              img: "/mathematics-background.png",
              letterColor: "text-white",
              wordColor: "text-white",
              titleColor: "text-light-pink",
              definition:
                "The universal language behind every field. Math develops logical thinking and powers science, tech, and art.",
            },
          ].map(
            ({
              letter,
              word,
              img,
              letterColor,
              wordColor,
              titleColor,
              definition,
            }) => (
              <div
                key={word}
                className="group relative h-72 md:h-96 lg:h-136 rounded-4xl overflow-hidden border-10 border-white shadow-xl flex flex-col items-center justify-center gap-3 py-6 cursor-pointer"
              >
                {/* Background image */}
                <Image
                  src={img}
                  alt={word}
                  fill
                  className="object-cover object-top scale-105 brightness-75 transition-all duration-500 group-hover:opacity-0"
                />

                {/* White hover overlay */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Default state: letter + word */}
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

                {/* Hover state: word title + definition */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span
                    className={`text-2xl md:text-4xl font-extrabold ${titleColor}`}
                    style={{ fontFamily: "var(--font-fredoka)" }}
                  >
                    {word}
                  </span>
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
      </section>

      {/* Career Guide Section */}
      <section className="bg-cream py-24 px-6 md:px-16 lg:px-24">
        {/* Title */}
        <div className="text-center mb-14">
          <h2
            className="text-5xl md:text-6xl font-extrabold text-dark-purple"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Career Guide
          </h2>
          <p
            className="text-2xl md:text-3xl text-dark-purple mt-1"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            how does it work?
          </p>
        </div>

        {/* Steps row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
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
                7 quick stages where we can learn what do you like.{" "}
                <span className="text-hot-pink font-semibold">
                  No previous knowledge needed.
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
                Get your STEM custom profile.{" "}
                <span className="text-girly-purple">
                  what is that career, what are they doing and why you are the
                  perfect fit.
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
                Women in STEM
              </h3>
              <p
                className="text-lg text-dark-purple mt-1 leading-relaxed"
                style={{ fontFamily: "var(--font-baloo)" }}
              >
                See STEM professionals.{" "}
                <span className="text-cute-orange">
                  Their story and how do they got there.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
