"use client";

import Image from "next/image";
import { FolderKanban, MapPin, Users, CalendarDays } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatDateOnly, type ProjectItem } from "./types";

export default function ProjectsList({ proyectos }: { proyectos: ProjectItem[] }) {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl bg-white border border-light-pink shadow-sm p-5">
      <h2 className="text-base font-extrabold text-dark-purple font-heading mb-3">
        {t("profile.projects")}
      </h2>

      {proyectos.length > 0 ? (
        <div className="space-y-3">
          {proyectos.map((p) => {
            const imagenes = p.imagenes ?? [];
            return (
              <div key={p.id} className="rounded-xl bg-cream/60 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-dark-purple">
                    {p.nombre}
                  </p>
                  {p.estado && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-girly-purple/10 text-girly-purple px-2 py-0.5 rounded-full shrink-0">
                      {p.estado.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-dark-purple/60 mt-1 line-clamp-3">
                  {p.descripcion}
                </p>

                {imagenes.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {imagenes.slice(0, 4).map((url) => (
                      <span
                        key={url}
                        className="relative h-14 w-14 rounded-lg overflow-hidden bg-white shrink-0"
                      >
                        <Image
                          src={url}
                          alt={p.nombre}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-dark-purple/50">
                  {(p.areasSTEM ?? []).map((area) => (
                    <span key={area} className="flex items-center gap-1">
                      <FolderKanban size={12} />
                      {t(`profile.areas.${area}`)}
                    </span>
                  ))}
                  {p.lugar && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {p.lugar}
                    </span>
                  )}
                  {p.cupoMaximo != null && (
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {p.cupoMaximo}
                    </span>
                  )}
                  {(p.fechaInicio || p.fechaFin) && (
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {formatDateOnly(p.fechaInicio)}
                      {p.fechaInicio && p.fechaFin ? " – " : ""}
                      {formatDateOnly(p.fechaFin)}
                    </span>
                  )}
                  {p.anio != null && <span>{p.anio}</span>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-dark-purple/40">{t("profile.noProjects")}</p>
      )}
    </div>
  );
}
