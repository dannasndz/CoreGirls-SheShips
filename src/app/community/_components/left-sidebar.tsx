"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Home, Users, Heart, Calendar, LogOut, Plus } from "lucide-react";
import { GroupData } from "./helpers";

type View = "feed" | "groups" | "liked";

interface LeftSidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  groups: GroupData[];
  onCreateGroup: () => void;
}

export function LeftSidebar({
  activeView,
  onViewChange,
  groups,
  onCreateGroup,
}: LeftSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
        <h3 className="text-sm font-bold text-girly-purple mb-3 font-[family-name:var(--font-fredoka)]">
          Navigation
        </h3>
        <nav className="space-y-1">
          <button
            onClick={() => onViewChange("feed")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm w-full text-left transition ${
              activeView === "feed"
                ? "bg-girly-purple/10 text-girly-purple"
                : "text-dark-purple hover:bg-light-pink/30"
            }`}
          >
            <Home size={18} />
            Home
          </button>
          <button
            onClick={() => onViewChange("liked")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm w-full text-left transition ${
              activeView === "liked"
                ? "bg-girly-purple/10 text-girly-purple"
                : "text-dark-purple hover:bg-light-pink/30"
            }`}
          >
            <Heart size={18} />
            Liked Posts
          </button>
          <button
            onClick={() => onViewChange("groups")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm w-full text-left transition ${
              activeView === "groups"
                ? "bg-girly-purple/10 text-girly-purple"
                : "text-dark-purple hover:bg-light-pink/30"
            }`}
          >
            <Users size={18} />
            Groups
          </button>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-purple hover:bg-light-pink/30 text-sm transition"
          >
            <Calendar size={18} />
            Events
          </a>
        </nav>
      </div>

      <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-girly-purple font-[family-name:var(--font-fredoka)]">
            My groups
          </h3>
          <button
            onClick={onCreateGroup}
            className="text-girly-purple hover:text-strong-purple transition"
          >
            <Plus size={16} />
          </button>
        </div>
        {groups.length === 0 ? (
          <p className="text-xs text-dark-purple/40">
            No groups yet -- create or join one!
          </p>
        ) : (
          <ul className="space-y-2 text-sm text-dark-purple">
            {groups.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/community/groups/${g.id}`}
                  className="flex items-center gap-2 hover:text-girly-purple transition"
                >
                  <Users
                    size={16}
                    className="text-dark-purple/50 shrink-0"
                  />
                  <span className="truncate">{g.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 text-sm text-dark-purple/60 hover:text-hot-pink transition px-2"
      >
        <LogOut size={16} />
        Log out
      </button>
    </aside>
  );
}
