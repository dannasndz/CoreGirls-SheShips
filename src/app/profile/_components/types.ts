export interface ProfileData {
  id: string;
  username: string;
  createdAt: string;
  quizResult: {
    career: string;
    answers: unknown;
    createdAt: string;
  } | null;
  posts: PostItem[];
  groupMemberships: GroupMembership[];
  events: EventItem[];
  eventAttendances: { event: EventItem }[];
  _count: {
    posts: number;
    comments: number;
    likes: number;
    groupMemberships: number;
    events: number;
    eventAttendances: number;
  };
}

export interface PostItem {
  id: string;
  title: string;
  content: string;
  categories: string[];
  createdAt: string;
  _count: { likes: number; comments: number };
}

export interface GroupMembership {
  role: string;
  joinedAt: string;
  group: { id: string; name: string; description: string };
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  hour: string;
  modality: string;
  cancelled: boolean;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const GLOW_COLOR = "236, 72, 153";

export const cardStyle = {
  backgroundColor: "var(--strong-purple)",
  "--glow-color": GLOW_COLOR,
  borderColor: "rgba(168, 85, 247, 0.3)",
} as React.CSSProperties;

export const cardClass = "magic-bento-card magic-bento-card--border-glow";
