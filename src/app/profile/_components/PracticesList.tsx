"use client";

import { Briefcase, CalendarDays } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatDateOnly } from "./types";
import type { PracticeItem } from "./types";

export default function PracticesList({
  practicas,
}: {
  practicas: PracticeItem[];
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl bg-white border border-light-pink shadow-sm p-5">
      <h2 className="text-base font-extrabold text-dark-purple font-heading mb-3">
        {t("profile.practices")}
      </h2>

      {practicas.length > 0 ? (
        <ul className="space-y-2">
          {practicas.map((p) => (
            <li key={p.id} className="rounded-xl bg-cream/60 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Briefcase size={16} className="text-strong-purple shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark-purple truncate">
                    {p.empresa}
                  </p>
                  <p className="text-xs text-dark-purple/50">{p.area}</p>
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-dark-purple/40 mt-1.5">
                <CalendarDays size={12} />
                {formatDateOnly(p.fechaInicio)}
                {" – "}
                {p.fechaFin
                  ? formatDateOnly(p.fechaFin)
                  : t("profile.inProgress")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-dark-purple/40">{t("profile.noPractices")}</p>
      )}
    </div>
  );
}
