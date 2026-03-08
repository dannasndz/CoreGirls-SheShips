"use client";

import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { GroupData } from "./helpers";
import { useI18n } from "@/lib/i18n";

interface GroupsListProps {
  groups: GroupData[];
  onCreateGroup: () => void;
}

export function GroupsList({ groups, onCreateGroup }: GroupsListProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-dark-purple font-[family-name:var(--font-fredoka)]">
          {t("community.allGroups")}
        </h2>
        <button
          onClick={onCreateGroup}
          className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-girly-purple text-girly-purple font-semibold text-sm hover:bg-girly-purple hover:text-white transition"
        >
          <Plus size={16} />
          {t("community.newGroup")}
        </button>
      </div>

      {groups.length === 0 && (
        <div className="rounded-2xl bg-white border border-[#E5E0D9] p-8 shadow-sm text-center">
          <p className="text-dark-purple/50 text-sm">
            {t("community.noGroups")}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((g) => (
          <Link
            key={g.id}
            href={`/community/groups/${g.id}`}
            className="rounded-2xl bg-white borderborder-[#E5E0D9] p-5 shadow-sm hover:border-girly-purple transition space-y-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-girly-purple/10 flex items-center justify-center">
                <Users size={20} className="text-girly-purple" />
              </div>
              <h3 className="text-xl font-bold text-dark-purple truncate">
                {g.name}
              </h3>
            </div>
            {g.description && (
              <p className="text-lg text-dark-purple/60 line-clamp-2">
                {g.description}
              </p>
            )}
            <p className="text-xs text-dark-purple/40">
              {g._count.members}{" "}
              {g._count.members !== 1 ? t("community.members") : t("community.member")}{" "}
              &middot;{" "}
              {g._count.posts}{" "}
              {g._count.posts !== 1 ? t("community.posts") : t("community.post")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
