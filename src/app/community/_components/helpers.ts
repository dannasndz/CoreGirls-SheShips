import type { Locale } from "@/lib/i18n";

const timeTemplates = {
  en: { m: "{n}m ago", h: "{n}h ago", d: "{n}d ago" },
  es: { m: "hace {n}m", h: "hace {n}h", d: "hace {n}d" },
} as const;

export function timeAgo(dateStr: string, locale: Locale = "es") {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const t = timeTemplates[locale];
  if (mins < 60) return t.m.replace("{n}", String(mins));
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t.h.replace("{n}", String(hours));
  const days = Math.floor(hours / 24);
  return t.d.replace("{n}", String(days));
}

export function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

const avatarColors = [
  "bg-cute-orange",
  "bg-girly-purple",
  "bg-hot-pink",
  "bg-strong-purple",
];

export function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export const STEM_CATEGORIES = [
  "Science",
  "Technology",
  "Engineer",
  "Mathematics",
];

export interface PostData {
  id: string;
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string | null;
    userType?: string;
  };
  likedByMe: boolean;
  _count: { likes: number; comments: number };
}

export interface GroupData {
  id: string;
  name: string;
  description: string;
  _count: { members: number; posts: number };
}

export interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; avatarUrl?: string | null };
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  modality: string;
  location: string | null;
  meetingLink: string | null;
  externalLink: string | null;
  date: string;
  hour: string;
  participantsLimit: number | null;
  organizerName: string;
  estado: string;
  createdAt: string;
  createdBy: { id: string; username: string; avatarUrl?: string | null };
  _count: { attendees: number };
}

export interface ProjectUser {
  id: string;
  username: string;
  fullName?: string;
  avatarUrl?: string | null;
  userType?: string;
}

export interface ProjectSolicitudData {
  id: string;
  estado: string;
  message: string | null;
  createdAt: string;
  decidedAt: string | null;
  userId: string;
  user: ProjectUser;
}

export interface ProjectData {
  id: string;
  nombre: string;
  descripcion: string;
  areasSTEM: string[];
  imagenes: string[];
  estado: string;
  anio: number | null;
  fechaPublicacion: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  lugar: string | null;
  modalidad: string | null;
  cupoMaximo: number | null;
  perfilInteresadas: string | null;
  createdAt: string;
  encargadas: ProjectUser[];
  interestedByMe: boolean;
  acceptedCount: number;
  mySolicitud: { id: string; estado: string } | null;
  solicitudes: ProjectSolicitudData[];
  _count: { interesadas: number; solicitudes: number };
}

export function formatProjectDate(dateStr: string | null, locale: Locale = "es") {
  if (!dateStr) return "";
  const parts = dateStr.slice(0, 10).split("-").map(Number);
  const [y, m, d] = parts;
  const date = y && m && d ? new Date(y, m - 1, d) : new Date(dateStr);
  return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatEventDate(dateStr: string, locale: Locale = "es") {
  return new Date(dateStr).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
