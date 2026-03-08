"use client";

import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-dark-purple text-white py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Team info */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-3xl font-extrabold text-hot-pink"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {t("footer.coreGirls")}
            </h3>
            <p
              className="text-base text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              {t("footer.teamDescription")}
            </p>
            <div
              className="flex flex-col gap-1 text-white/80"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              <span>Andrea Rivas Gómez</span>
              <span>Teresa Rivas Gómez</span>
              <span>Danna Guadalupe Sández Islas</span>
            </div>
          </div>

          {/* Hackathon info */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-3xl font-extrabold text-girly-purple"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {t("footer.sheships")}
            </h3>
            <p
              className="text-base text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              <span className="text-white font-semibold">
                {t("footer.hackathonTitle")}
              </span>{" "}
              {t("footer.hackathonSuffix")}
            </p>
            <p
              className="text-base text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              {t("footer.hackathonDescription")}
            </p>
          </div>

          {/* Mission */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-3xl font-extrabold text-cute-orange"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {t("footer.mission")}
            </h3>
            <p
              className="text-base text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              {t("footer.missionText")}
            </p>
          </div>
        </div>

        {/* Divider + bottom */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-sm text-white/50"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            {t("footer.madeWith")}
          </p>
          <p
            className="text-sm text-white/50"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            {t("footer.notJustHackathon")}
          </p>
        </div>
      </div>
    </footer>
  );
}
