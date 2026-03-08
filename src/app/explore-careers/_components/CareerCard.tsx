import Image from "next/image";
import { Career } from "@/data/careers";

const getCareerImage = (id: string) => {
  if (id === "database-administrator") return "/careers/database-administrato.png";
  return `/careers/${id}.png`;
};

type CareerCardProps = {
  career: Career;
  onClick: (career: Career) => void;
};

export default function CareerCard({ career, onClick }: CareerCardProps) {
  return (
    <button
      onClick={() => onClick(career)}
      className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg flex flex-col items-center justify-end p-4 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
    >
      {/* Background image */}
      <Image
        src={getCareerImage(career.id)}
        alt={career.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Gradient overlay at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* Category badge */}
      <span className="absolute top-3 right-3 bg-girly-purple/90 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {career.category === "S" && "Science"}
        {career.category === "T" && "Technology"}
        {career.category === "E" && "Engineering"}
        {career.category === "M" && "Mathematics"}
      </span>

      {/* Growth badge */}
      {career.growth && (
        <span className="absolute top-3 left-3 bg-white/80 text-cute-orange text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
          🔥 Trending
        </span>
      )}

      {/* Career name */}
      <h3
        className="relative z-10 text-white font-extrabold text-lg md:text-xl text-center leading-tight drop-shadow-md"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {career.name}
      </h3>
    </button>
  );
}
