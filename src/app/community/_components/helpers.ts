export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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

export function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
