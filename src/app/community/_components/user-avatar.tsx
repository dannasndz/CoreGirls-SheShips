"use client";

import Image from "next/image";
import Link from "next/link";
import { getAvatarColor, getInitial } from "./helpers";

export interface AvatarUser {
  id: string;
  username: string;
  avatarUrl?: string | null;
}

export function UserAvatar({
  user,
  size = 32,
  linked = true,
}: {
  user: AvatarUser;
  size?: number;
  linked?: boolean;
}) {
  const avatar = (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden text-white font-bold ${
        user.avatarUrl ? "bg-cream" : getAvatarColor(user.username)
      }`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.username}
          width={size}
          height={size}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        getInitial(user.username)
      )}
    </span>
  );

  if (!linked) return avatar;

  return (
    <Link
      href={`/profile/${user.id}`}
      aria-label={`${user.username}`}
      className="shrink-0 rounded-full transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-girly-purple"
    >
      {avatar}
    </Link>
  );
}
