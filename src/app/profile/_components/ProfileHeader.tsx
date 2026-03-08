"use client";

import { User, CalendarDays } from "lucide-react";
import { formatDate } from "./types";
import { useI18n } from "@/lib/i18n";

interface ProfileHeaderProps {
  username: string;
  createdAt: string;
}

export default function ProfileHeader({
  username,
  createdAt,
}: ProfileHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl bg-white border border-light-pink shadow-sm p-4 flex items-center gap-4">
      <div className="relative shrink-0">
        <div
          className="absolute -inset-2 rounded-full bg-linear-to-br from-girly-purple/25 via-hot-pink/20 to-cute-orange/25 blur-md animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-strong-purple via-hot-pink to-cute-orange
          flex items-center justify-center ring-3 ring-white shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-girly-purple">Welcome back,</p>
        <h1 className="text-lg font-extrabold text-dark-purple font-heading leading-tight truncate">
          {username}
        </h1>
        <p className="text-dark-purple/40 flex items-center gap-1.5 text-[11px] mt-1">
          <CalendarDays className="w-3 h-3" />
          Member since {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
}
