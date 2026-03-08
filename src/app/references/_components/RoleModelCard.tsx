import Image from "next/image";
import { Linkedin, History } from "lucide-react";
import { RoleModel, categoryLabels } from "@/data/roleModels";

type RoleModelCardProps = {
  roleModel: RoleModel;
};

export default function RoleModelCard({ roleModel }: RoleModelCardProps) {
  const categoryColors: Record<string, string> = {
    S: "bg-girly-purple/15 text-girly-purple",
    T: "bg-hot-pink/15 text-hot-pink",
    E: "bg-cute-orange/15 text-cute-orange",
    M: "bg-light-pink/30 text-dark-purple",
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col">
      {/* Photo */}
      <div className="relative w-full aspect-[4/3] bg-cream">
        <Image
          src={roleModel.photo}
          alt={roleModel.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[roleModel.category]}`}
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {categoryLabels[roleModel.category]}
          </span>
          {roleModel.historical && (
            <span
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-cute-orange/15 text-cute-orange"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <History size={10} />
              Pioneer
            </span>
          )}
        </div>

        {/* Field */}
        <p
          className="text-xs text-dark-purple/50 font-semibold"
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          {roleModel.field}
        </p>

        {/* Name + Country */}
        <div>
          <h3
            className="text-lg font-extrabold text-dark-purple leading-tight"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {roleModel.name}
          </h3>
          <p
            className="text-sm text-dark-purple/50"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            {roleModel.country}
          </p>
        </div>

        {/* Summary */}
        <p
          className="text-sm text-dark-purple/70 leading-relaxed flex-1"
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          {roleModel.summary}
        </p>

        {/* LinkedIn */}
        {roleModel.linkedin && (
          <a
            href={roleModel.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-girly-purple hover:text-hot-pink transition-colors mt-auto"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            <Linkedin size={16} />
            LinkedIn Profile
          </a>
        )}
      </div>
    </div>
  );
}
