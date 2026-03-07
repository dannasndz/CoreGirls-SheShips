import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 px-8 md:px-16 lg:px-24 py-10 md:py-0 md:min-h-[calc(100vh-60px)]">
        {/* Left: Slogan + Buttons */}
        <div className="flex flex-col items-center md:items-start gap-6 w-full md:w-1/2">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-br from-girly-purple via-hot-pink to-cute-orange hover:from-cute-orange hover:via-hot-pink hover:to-girly-purple text-white font-semibold text-2xl transition-all duration-500 ease-in-out shadow-md"
            >
              Take the Quiz
              <Image
                src="/quiz-icon.svg"
                alt="quiz icon"
                width={24}
                height={24}
                className="object-contain relative -top-0.5"
              />
            </Link>

            {/* Explore button */}
            <Link
              href="/explore-careers"
              className="inline-flex items-center px-6 py-3 rounded-full border-2 border-cute-orange text-cute-orange font-semibold text-2xl hover:bg-cute-orange hover:text-white transition-all duration-300"
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
        className="relative w-full py-18 px-6 md:px-16 lg:px-24 md:py-24 md:min-h-[calc(80vh-60px)] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/background-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Purple overlay */}
        <div className="absolute inset-0 bg-girly-purple/60" />

        {/* Section heading */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-8xl">
          <div className="text-center mb-14">
            <h2
              className="text-6xl md:text-7xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              The Future of STEM Needs You
            </h2>
            <p
              className="text-2xl md:text-3xl text-white/80 mt-3 bg-strong-purple/50 px-4 py-2 rounded-full inline-block"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              Women are underrepresented in every STEM field. You can change that.
            </p>
          </div>

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
              stat: "Only 33% of researchers worldwide are women.",
              definition:
                "From Nobel laureate Marie Curie to ecologist Sandra Díaz, women in science are rewriting the rules. Your curiosity could lead the next breakthrough.",
            },
            {
              letter: "T",
              word: "Technology",
              img: "/technology-background.png",
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
              img: "/engineering-background.png",
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
              img: "/mathematics-background.png",
              letterColor: "text-white",
              wordColor: "text-white",
              titleColor: "text-light-pink",
              stat: "Maryam Mirzakhani was the first woman to win the Fields Medal.",
              definition:
                "Math is the foundation of every STEM field and opens every door. From data science to cryptography — let it open yours.",
            },
          ].map(
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

                {/* Hover state: stat + definition */}
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

      {/* Career Guide Section */}
      <section className="bg-cream py-24 px-6 md:px-16 lg:px-24">
        {/* Title */}
        <div className="text-center mb-14">
          <h2
            className="text-6xl md:text-7xl font-extrabold text-dark-purple"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Your Journey Starts Here
          </h2>
          <p
            className="text-3xl md:text-4xl text-dark-purple mt-2"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            three simple steps to find your STEM path
          </p>
        </div>

        {/* Steps row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:min-h-[calc(40vh-60px)]">
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
                  No pressure, no right or wrong answers — just discover what excites you.
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
                  Learn what the career looks like, what you'd be doing, and
                  why you're the perfect match.
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
                  Read their stories, learn from their journeys, and see yourself in their success.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
