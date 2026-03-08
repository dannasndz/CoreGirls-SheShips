import { User, CalendarDays } from "lucide-react";
import { formatDate } from "./types";

interface ProfileHeaderProps {
  username: string;
  createdAt: string;
  counts: {
    posts: number;
    comments: number;
    likes: number;
    groupMemberships: number;
  };
}

export default function ProfileHeader({
  username,
  createdAt,
  counts,
}: ProfileHeaderProps) {
  return (
    <div className="w-full bg-gradient-to-r from-dark-purple via-strong-purple to-girly-purple py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-hot-pink via-cute-orange to-light-pink flex items-center justify-center shrink-0 ring-4 ring-white/20">
          <User className="w-10 h-10 text-white" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-fredoka)]">
            {username}
          </h1>
          <p className="text-light-pink flex items-center justify-center sm:justify-start gap-1.5 text-sm mt-1">
            <CalendarDays className="w-3.5 h-3.5" />
            Joined {formatDate(createdAt)}
          </p>
        </div>
        <div className="sm:ml-auto flex gap-3 flex-wrap justify-center">
          <HeaderStat value={counts.posts} label="Posts" />
          <HeaderStat value={counts.comments} label="Comments" />
          <HeaderStat value={counts.likes} label="Likes" />
          <HeaderStat value={counts.groupMemberships} label="Groups" />
        </div>
      </div>
    </div>
  );
}

function HeaderStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white/10 rounded-xl px-4 py-2 min-w-[60px]">
      <span className="text-white font-bold text-lg leading-tight">
        {value}
      </span>
      <span className="text-light-pink/70 text-xs">{label}</span>
    </div>
  );
}
