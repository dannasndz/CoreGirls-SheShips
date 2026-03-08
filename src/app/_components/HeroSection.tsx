import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
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
          <Link
            href="/preQuiz"
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
  );
}
