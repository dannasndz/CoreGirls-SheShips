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
  author: { id: string; username: string };
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
  author: { id: string; username: string };
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
  cancelled: boolean;
  createdAt: string;
  createdBy: { id: string; username: string };
  _count: { attendees: number };
}

export function formatEventDate(dateStr: string, locale: Locale = "es") {
  return new Date(dateStr).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
