export default function Footer() {
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
              Core Girls
            </h3>
            <p
              className="text-base text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              We are a team of three passionate women from Mexico who believe
              every girl deserves to see herself in STEM.
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
              💜 #SheShips
            </h3>
            <p
              className="text-base text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              <span className="text-white font-semibold">
                Global Hackathon 8M
              </span>{" "}
              — Build. Share. Launch.
            </p>
            <p
              className="text-base text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              A 48-hour remote hackathon celebrating International Women&apos;s
              Day (March 6–8) where women and multidisciplinary creators come
              together to build and publish something real.
            </p>
          </div>

          {/* Mission */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-3xl font-extrabold text-cute-orange"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Our Mission
            </h3>
            <p
              className="text-base text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              Dismantling the structural barriers, lack of information, and
              invisibility of female leaders that perpetuate the gender gap in
              STEM across Latin America, empowering the next generation of women
              to confidently claim their space in science and technology.
            </p>
          </div>
        </div>

        {/* Divider + bottom */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-sm text-white/50"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            Made with 💜 by Core Girls · #SheShips Hackathon 8M · March 2026
          </p>
          <p
            className="text-sm text-white/50"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            This is not just a hackathon. This is a space to ship.
          </p>
        </div>
      </div>
    </footer>
  );
}
