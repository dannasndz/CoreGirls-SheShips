"use client";

import Image from "next/image";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import { useI18n } from "@/lib/i18n";

export default function RoleModelsSection() {
  const { t } = useI18n();

  const roleModels = [
    {
      name: "Julieta Fierro",
      field: t("roleModels.julieta.field"),
      about: t("roleModels.julieta.about"),
      color: "bg-girly-purple",
      photo: "/woman/julieta.png",
    },
    {
      name: "Sandra Díaz",
      field: t("roleModels.sandra.field"),
      about: t("roleModels.sandra.about"),
      color: "bg-cute-orange",
      photo: "/woman/sandra.png",
    },
    {
      name: "Silvia Torres-Peimbert",
      field: t("roleModels.silvia.field"),
      about: t("roleModels.silvia.about"),
      color: "bg-dark-purple",
      photo: "/woman/silvia.png",
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
      <div className="absolute inset-0 bg-hot-pink/80" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SplitText
            text={t("roleModels.heading")}
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
            className="text-2xl md:text-3xl text-white/80 mt-3 bg-pink-900/20 px-4 py-2 rounded-full inline-block shadow-sm"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            {t("roleModels.subheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roleModels.map(({ name, field, about, color, photo }) => (
            <div
              key={name}
              className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center text-center gap-4 hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`w-28 h-28 rounded-full ${color} overflow-hidden shadow-lg`}
              >
                <Image
                  src={photo}
                  alt={name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3
                  className="text-2xl font-extrabold text-dark-purple"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  {name}
                </h3>
                <p
                  className="text-lg text-hot-pink font-semibold"
                  style={{ fontFamily: "var(--font-baloo)" }}
                >
                  {field}
                </p>
              </div>

              <p
                className="text-base text-dark-purple/80 leading-relaxed"
                style={{ fontFamily: "var(--font-baloo)" }}
              >
                {about}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/references"
            className="inline-flex items-center gap-2 text-white text-xl font-semibold underline underline-offset-4 hover:text-white/80 transition-colors"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            {t("roleModels.discoverMore")}
          </Link>
        </div>
      </div>
    </section>
  );
}
