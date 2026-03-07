export default function Home() {
  return (
    <div className="min-h-screen bg-cream p-10 space-y-10">

      {/* Typography */}
      <section className="space-y-2">
        <h1 className="text-4xl font-bold text-girly-purple">
          Título principal — girly-purple
        </h1>
        <h2 className="text-2xl font-semibold text-strong-purple">
          Subtítulo — strong-purple
        </h2>
        <p className="text-base text-dark-purple">
          Texto de cuerpo — dark-purple. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </section>

      {/* Color palette */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-strong-purple">Color palette</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { name: "strong-purple", hex: "#6B21A8", bg: "bg-strong-purple", light: true },
            { name: "girly-purple", hex: "#A855F7", bg: "bg-girly-purple", light: true },
            { name: "hot-pink", hex: "#EC4899", bg: "bg-hot-pink", light: true },
            { name: "light-pink", hex: "#F9A8D4", bg: "bg-light-pink", light: false },
            { name: "cute-orange", hex: "#F97316", bg: "bg-cute-orange", light: true },
            { name: "dark-purple", hex: "#1A0A2E", bg: "bg-dark-purple", light: true },
            { name: "cream", hex: "#FDFAF6", bg: "bg-cream", light: false },
          ].map(({ name, hex, bg, light }) => (
            <div
              key={name}
              className={`w-32 h-24 rounded-xl flex flex-col items-center justify-center shadow-md border border-light-pink ${bg}`}
            >
              <span className={`text-xs font-bold ${light ? "text-white" : "text-dark-purple"}`}>
                {name}
              </span>
              <span className={`text-xs ${light ? "text-white/80" : "text-dark-purple/70"}`}>
                {hex}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-strong-purple">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2 rounded-lg bg-girly-purple text-white font-medium hover:opacity-90 transition">
            Primary
          </button>
          <button className="px-5 py-2 rounded-lg bg-strong-purple text-white font-medium hover:opacity-90 transition">
            Secondary
          </button>
          <button className="px-5 py-2 rounded-lg bg-hot-pink text-white font-medium hover:opacity-90 transition">
            Hot pink
          </button>
          <button className="px-5 py-2 rounded-lg bg-cute-orange text-white font-medium hover:opacity-90 transition">
            Cute orange
          </button>
          <button className="px-5 py-2 rounded-lg bg-light-pink text-dark-purple font-medium hover:opacity-90 transition">
            Light pink
          </button>
          <button className="px-5 py-2 rounded-lg border-2 border-girly-purple text-girly-purple font-medium hover:bg-girly-purple hover:text-white transition">
            Outline
          </button>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-strong-purple">Cards</h2>
        <div className="flex flex-wrap gap-4">
          <div className="w-64 p-5 rounded-2xl bg-white border border-light-pink shadow-sm space-y-2">
            <h3 className="text-lg font-bold text-girly-purple">Light card</h3>
            <p className="text-sm text-dark-purple">Texto de ejemplo usando los colores del proyecto.</p>
            <span className="inline-block px-3 py-1 rounded-full bg-light-pink text-strong-purple text-xs font-semibold">
              Label
            </span>
          </div>
          <div className="w-64 p-5 rounded-2xl bg-dark-purple shadow-sm space-y-2">
            <h3 className="text-lg font-bold text-girly-purple">Dark card</h3>
            <p className="text-sm text-cream">Dark purple background with cream text.</p>
            <span className="inline-block px-3 py-1 rounded-full bg-cute-orange text-white text-xs font-semibold">
              Accent
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}

