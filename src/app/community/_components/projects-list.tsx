"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Users,
  CalendarDays,
  Video,
  Building2,
  UserCheck,
  FolderKanban,
  Heart,
  Pencil,
  Check,
  X,
  Clock,
} from "lucide-react";
import { ProjectData, formatProjectDate } from "./helpers";
import { UserAvatar } from "./user-avatar";
import { canCreateProject, canManageProject } from "@/lib/projects-validation";
import { useI18n } from "@/lib/i18n";

interface ProjectsListProps {
  projects: ProjectData[];
  loading: boolean;
  onCreateProject: () => void;
  onEditProject: (project: ProjectData) => void;
  onInterest: (projectId: string) => Promise<void>;
  onRequest: (projectId: string) => Promise<void>;
  onCancelRequest: (projectId: string) => Promise<void>;
  onDecideRequest: (
    projectId: string,
    requestId: string,
    estado: "aceptada" | "rechazada"
  ) => Promise<void>;
  currentUserType?: string;
  currentUserId?: string;
}

function isPastDate(value: string | null | undefined): boolean {
  if (!value) return false;
  const parts = value.slice(0, 10).split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return false;
  return Date.now() > new Date(y, m - 1, d, 23, 59, 59).getTime();
}

export function ProjectsList({
  projects,
  loading,
  onCreateProject,
  onEditProject,
  onInterest,
  onRequest,
  onCancelRequest,
  onDecideRequest,
  currentUserType,
  currentUserId,
}: ProjectsListProps) {
  const { t, locale } = useI18n();
  const [busy, setBusy] = useState<string | null>(null);

  const canCreate = canCreateProject(currentUserType);
  const canInteract = currentUserType === "ALUMNA";

  const estadoStyles: Record<string, string> = {
    abierto: "bg-green-100 text-green-700",
    en_progreso: "bg-cute-orange/10 text-cute-orange",
    cerrado: "bg-dark-purple/10 text-dark-purple/60",
  };

  const modalidadIcons: Record<string, React.ReactNode> = {
    presencial: <Building2 size={14} />,
    virtual: <Video size={14} />,
    hibrido: <Video size={14} />,
  };

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    await fn();
    setBusy(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-dark-purple font-[family-name:var(--font-fredoka)]">
          {t("projects.title")}
        </h2>
        {canCreate && (
          <button
            onClick={onCreateProject}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-girly-purple text-girly-purple font-semibold text-sm hover:bg-girly-purple hover:text-white transition"
          >
            <Plus size={16} />
            {t("projects.newProject")}
          </button>
        )}
      </div>

      {loading && (
        <div className="rounded-2xl bg-white border border-[#E5E0D9] p-8 shadow-sm text-center">
          <p className="text-girly-purple text-sm font-medium animate-pulse">
            {t("projects.loadingProjects")}
          </p>
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="rounded-2xl bg-white border border-[#E5E0D9] p-8 shadow-sm text-center">
          <p className="text-dark-purple/50 text-sm">
            {t("projects.noProjects")}
          </p>
        </div>
      )}

      {projects.map((project) => {
        const estadoLabel =
          t(`projects.estados.${project.estado}`) || project.estado;
        const modalidadLabel = project.modalidad
          ? t(`projects.modalidades.${project.modalidad}`) || project.modalidad
          : null;
        const encargadaIds = project.encargadas.map((e) => e.id);
        const isManager = canManageProject(currentUserId, encargadaIds);
        const mySolicitud = project.mySolicitud;
        const pending = project.solicitudes.filter(
          (s) => s.estado === "pendiente"
        );
        const accepted = project.acceptedCount ?? 0;
        const isFull =
          project.cupoMaximo != null && accepted >= project.cupoMaximo;
        const isClosed = project.estado === "cerrado";
        const deadlinePassed = isPastDate(project.fechaFin);
        const canRequest = !isManager && !isClosed && !isFull && !deadlinePassed;

        return (
          <div
            key={project.id}
            className="rounded-2xl bg-white border border-[#E5E0D9] p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-dark-purple">
                    {project.nombre}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      estadoStyles[project.estado] ??
                      "bg-girly-purple/10 text-girly-purple"
                    }`}
                  >
                    {estadoLabel}
                  </span>
                </div>
                <p className="text-xs text-dark-purple/40">
                  {t("projects.publishedOn", {
                    date: formatProjectDate(project.fechaPublicacion, locale),
                  })}
                </p>
                <p className="text-dark-purple/70">{project.descripcion}</p>
              </div>
              {isManager && (
                <button
                  onClick={() => onEditProject(project)}
                  className="p-1.5 rounded-lg text-dark-purple/40 hover:text-girly-purple hover:bg-light-pink/30 transition shrink-0"
                  title={t("projects.editProject")}
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>

            {(project.imagenes ?? []).length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {project.imagenes.map((url) => (
                  <span
                    key={url}
                    className="relative h-28 w-28 rounded-xl overflow-hidden bg-cream shrink-0"
                  >
                    <Image
                      src={url}
                      alt={project.nombre}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-dark-purple/60">
              {(project.fechaInicio || project.fechaFin) && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {formatProjectDate(project.fechaInicio, locale)}
                  {project.fechaInicio && project.fechaFin ? " – " : ""}
                  {formatProjectDate(project.fechaFin, locale)}
                </span>
              )}
              {project.lugar && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {project.lugar}
                </span>
              )}
              {modalidadLabel && (
                <span className="flex items-center gap-1.5">
                  {modalidadIcons[project.modalidad ?? ""] ?? <Video size={14} />}
                  {modalidadLabel}
                </span>
              )}
              {project.cupoMaximo != null && (
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {accepted}/{project.cupoMaximo}
                </span>
              )}
              {(project.areasSTEM ?? []).map((area) => (
                <span key={area} className="flex items-center gap-1.5">
                  <FolderKanban size={14} />
                  {t(`profile.areas.${area}`)}
                </span>
              ))}
            </div>

            {project.perfilInteresadas && (
              <p className="flex items-start gap-1.5 text-sm text-dark-purple/60">
                <UserCheck size={14} className="mt-0.5 shrink-0" />
                <span>
                  {t("projects.profileInterested")}: {project.perfilInteresadas}
                </span>
              </p>
            )}

            <div className="flex items-center gap-3 flex-wrap text-sm text-dark-purple/50">
              <span className="flex items-center gap-1.5">
                {project.encargadas.length > 1
                  ? t("projects.ledByMany")
                  : t("projects.ledBy")}
              </span>
              <span className="flex items-center gap-2 flex-wrap">
                {project.encargadas.map((e) => (
                  <Link
                    key={e.id}
                    href={`/profile/${e.id}`}
                    className="inline-flex items-center gap-1.5 hover:text-girly-purple transition"
                  >
                    <UserAvatar user={e} size={24} linked={false} />
                    {e.username}
                  </Link>
                ))}
              </span>
            </div>

            {/* Solicitudes (vista de encargadas) */}
            {isManager && pending.length > 0 && (
              <div className="rounded-xl bg-cream/60 p-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-dark-purple/50">
                  {t("projects.pendingRequests")} ({pending.length})
                </p>
                {pending.map((s) => {
                  const key = `${project.id}:${s.id}`;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <Link
                        href={`/profile/${s.userId}`}
                        className="flex items-center gap-2 text-sm text-dark-purple hover:text-girly-purple transition min-w-0"
                      >
                        <UserAvatar user={s.user} size={22} linked={false} />
                        <span className="truncate">
                          {s.user.username}
                          {s.message ? ` · ${s.message}` : ""}
                        </span>
                      </Link>
                      <span className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() =>
                            run(key, () =>
                              onDecideRequest(project.id, s.id, "aceptada")
                            )
                          }
                          disabled={busy === key}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                          title={t("projects.accept")}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() =>
                            run(key, () =>
                              onDecideRequest(project.id, s.id, "rechazada")
                            )
                          }
                          disabled={busy === key}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title={t("projects.decline")}
                        >
                          <X size={16} />
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E5E0D9]/50">
              <span className="flex items-center gap-1.5 text-sm text-dark-purple/50">
                <Users size={14} />
                {project._count.interesadas}{" "}
                {project._count.interesadas === 1
                  ? t("projects.interestedOne")
                  : t("projects.interestedMany")}
              </span>

              {canInteract && !isManager && (
                <button
                  onClick={() => run(`i:${project.id}`, () => onInterest(project.id))}
                  disabled={busy === `i:${project.id}`}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    project.interestedByMe
                      ? "border-2 border-hot-pink text-hot-pink hover:bg-light-pink/20"
                      : "bg-girly-purple text-white hover:bg-strong-purple"
                  }`}
                >
                  <Heart
                    size={14}
                    className={project.interestedByMe ? "fill-hot-pink" : ""}
                  />
                  {busy === `i:${project.id}`
                    ? "..."
                    : project.interestedByMe
                      ? t("projects.interested")
                      : t("projects.expressInterest")}
                </button>
              )}

              {!isManager && (
                <>
                  {!mySolicitud && canRequest && (
                    <button
                      onClick={() => run(`r:${project.id}`, () => onRequest(project.id))}
                      disabled={busy === `r:${project.id}`}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold border-2 border-girly-purple text-girly-purple hover:bg-girly-purple hover:text-white transition"
                    >
                      {busy === `r:${project.id}`
                        ? "..."
                        : t("projects.requestJoin")}
                    </button>
                  )}
                  {!mySolicitud && !canRequest && !isClosed && (
                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-light-pink/30 text-dark-purple/50">
                      {deadlinePassed
                        ? t("projects.requestClosedDeadline")
                        : t("projects.requestFull")}
                    </span>
                  )}
                  {!mySolicitud && !canRequest && isClosed && (
                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-dark-purple/10 text-dark-purple/50">
                      {t("projects.requestClosed")}
                    </span>
                  )}
                  {mySolicitud?.estado === "pendiente" && (
                    <button
                      onClick={() =>
                        run(`c:${project.id}`, () => onCancelRequest(project.id))
                      }
                      disabled={busy === `c:${project.id}`}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border border-cute-orange text-cute-orange hover:bg-cute-orange/10 transition"
                    >
                      <Clock size={14} />
                      {busy === `c:${project.id}`
                        ? "..."
                        : t("projects.requestPending")}
                    </button>
                  )}
                  {mySolicitud?.estado === "aceptada" && (
                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      <Check size={14} />
                      {t("projects.requestAccepted")}
                    </span>
                  )}
                  {mySolicitud?.estado === "rechazada" && (
                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-600">
                      <X size={14} />
                      {t("projects.requestRejected")}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
