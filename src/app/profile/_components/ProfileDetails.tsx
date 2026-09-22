"use client";

import Image from "next/image";
import {
  User,
  MapPin,
  GraduationCap,
  Building2,
  Briefcase,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "./types";

interface ProfileDetailsProps {
  data: {
    fullName?: string | null;
    username?: string;
    userType?: string;
    avatarUrl?: string | null;
    accountStatus?: string | null;
    institution?: string | null;
    campus?: string | null;
    carrera?: string | null;
    semestre?: number | null;
    sector?: string | null;
    areaSTEM?: string | null;
    materias?: string[];
    ocupacion?: string | null;
    ubicacion?: string | null;
    fechaIngreso?: string | null;
    fechaEgreso?: string | null;
    fechaIngresoAlumna?: string | null;
    fechaInicioLabor?: string | null;
    clubs?: string[];
    description?: string | null;
    interests?: string[];
  };
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-girly-purple mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-purple/40">
          {label}
        </p>
        <p className="text-sm text-dark-purple font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const config: Record<string, { icon: React.ReactNode; className: string }> = {
    PENDING: {
      icon: <Clock size={12} />,
      className: "bg-amber-100 text-amber-600",
    },
    VERIFIED: {
      icon: <CheckCircle2 size={12} />,
      className: "bg-green-100 text-green-600",
    },
    REJECTED: {
      icon: <XCircle size={12} />,
      className: "bg-red-100 text-red-600",
    },
  };
  const { icon, className } = config[status] ?? config.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${className}`}
    >
      {icon}
      {t(`profile.statuses.${status}`)}
    </span>
  );
}

export default function ProfileDetails({ data }: ProfileDetailsProps) {
  const { t } = useI18n();

  const initial = (data.fullName || data.username || "?").charAt(0).toUpperCase();

  const userTypeLabel = data.userType
    ? t(`profile.userTypes.${data.userType}`)
    : "";
  const campusLabel = data.campus ? t(`profile.campusNames.${data.campus}`) : "";
  const areaLabel = data.areaSTEM ? t(`profile.areas.${data.areaSTEM}`) : "";
  const statusLabel = data.accountStatus;
  const interests = data.interests ?? [];

  return (
    <div className="rounded-2xl bg-white border border-light-pink shadow-sm p-5">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-strong-purple via-hot-pink to-cute-orange flex items-center justify-center ring-2 ring-white shadow-lg shrink-0">
          {data.avatarUrl ? (
            <Image
              src={data.avatarUrl}
              alt={data.fullName ?? "avatar"}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : initial ? (
            <span className="text-xl font-extrabold text-white">{initial}</span>
          ) : (
            <User className="w-7 h-7 text-white" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-extrabold text-dark-purple font-heading leading-tight truncate">
            {data.fullName || data.username}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {data.username && (
              <span className="text-xs text-dark-purple/50">@{data.username}</span>
            )}
            {userTypeLabel && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-girly-purple/10 text-girly-purple">
                {userTypeLabel}
              </span>
            )}
            {statusLabel && <StatusBadge status={statusLabel} />}
          </div>
        </div>
      </div>

      {data.description && (
        <div className="mt-4 pt-4 border-t border-light-pink/60">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-purple/40 mb-1">
            {t("profile.aboutMe")}
          </p>
          <p className="text-sm text-dark-purple/80 leading-relaxed whitespace-pre-line">
            {data.description}
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-light-pink/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {campusLabel && (
          <InfoRow icon={<MapPin size={15} />} label={t("profile.campus")} value={campusLabel} />
        )}
        {data.institution && (
          <InfoRow
            icon={<Building2 size={15} />}
            label={t("profile.institution")}
            value={data.institution}
          />
        )}

        {data.userType === "ALUMNA" && (
          <>
            {data.carrera && (
              <InfoRow
                icon={<GraduationCap size={15} />}
                label={t("profile.career")}
                value={data.carrera}
              />
            )}
            {data.semestre != null && (
              <InfoRow
                icon={<BookOpen size={15} />}
                label={t("profile.semester")}
                value={String(data.semestre)}
              />
            )}
            {data.fechaIngresoAlumna && (
              <InfoRow
                icon={<CalendarDays size={15} />}
                label={t("profile.entryDateLabel")}
                value={formatDate(data.fechaIngresoAlumna)}
              />
            )}
          </>
        )}

        {data.userType === "ACADEMICA" && (
          <>
            {data.sector && (
              <InfoRow
                icon={<Briefcase size={15} />}
                label={t("profile.sector")}
                value={data.sector}
              />
            )}
            {areaLabel && (
              <InfoRow
                icon={<BookOpen size={15} />}
                label={t("profile.areaStem")}
                value={areaLabel}
              />
            )}
            {data.fechaInicioLabor && (
              <InfoRow
                icon={<CalendarDays size={15} />}
                label={t("profile.laborStart")}
                value={formatDate(data.fechaInicioLabor)}
              />
            )}
          </>
        )}

        {data.userType === "EGRESADA" && (
          <>
            {data.carrera && (
              <InfoRow
                icon={<GraduationCap size={15} />}
                label={t("profile.career")}
                value={data.carrera}
              />
            )}
            {data.ocupacion && (
              <InfoRow
                icon={<Briefcase size={15} />}
                label={t("profile.occupation")}
                value={data.ocupacion}
              />
            )}
            {data.ubicacion && (
              <InfoRow
                icon={<MapPin size={15} />}
                label={t("profile.location")}
                value={data.ubicacion}
              />
            )}
            {data.fechaIngreso && (
              <InfoRow
                icon={<CalendarDays size={15} />}
                label={t("profile.entryDateLabel")}
                value={formatDate(data.fechaIngreso)}
              />
            )}
            {data.fechaEgreso && (
              <InfoRow
                icon={<CalendarDays size={15} />}
                label={t("profile.graduationDate")}
                value={formatDate(data.fechaEgreso)}
              />
            )}
          </>
        )}
      </div>

      {(data.materias?.length ?? 0) > 0 && data.userType === "ACADEMICA" && (
        <div className="mt-4 pt-4 border-t border-light-pink/60">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-purple/40 mb-2">
            {t("profile.subjects")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.materias!.map((m) => (
              <span
                key={m}
                className="bg-light-pink/30 text-dark-purple text-[11px] font-medium px-2.5 py-1 rounded-full"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {(data.clubs?.length ?? 0) > 0 && (
        <div className="mt-4 pt-4 border-t border-light-pink/60">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-purple/40 mb-2">
            {t("profile.clubs")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.clubs!.map((c) => (
              <span
                key={c}
                className="bg-light-pink/30 text-dark-purple text-[11px] font-medium px-2.5 py-1 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {interests.length > 0 && (
        <div className="mt-4 pt-4 border-t border-light-pink/60">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-purple/40 mb-2">
            {t("profile.interests")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {interests.map((i) => (
              <span
                key={i}
                className="bg-girly-purple/10 text-girly-purple text-[11px] font-semibold px-2.5 py-1 rounded-full"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
