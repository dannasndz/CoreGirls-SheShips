import Link from "next/link";
import { ParticleCard } from "@/components/MagicBento";
import { Users } from "lucide-react";
import { GLOW_COLOR, cardStyle, cardClass } from "./types";
import type { GroupMembership } from "./types";

interface GroupsCardProps {
  memberships: GroupMembership[];
}

export default function GroupsCard({ memberships }: GroupsCardProps) {
  return (
    <ParticleCard
      className={cardClass}
      style={cardStyle}
      glowColor={GLOW_COLOR}
      enableTilt={false}
      clickEffect
      particleCount={6}
    >
      <div className="p-2">
        <div className="flex items-center gap-2 text-white text-s mb-3">
          <Users className="w-4 h-4" />
          <span>My Groups</span>
        </div>
        {memberships.length > 0 ? (
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
            {memberships.map((m) => (
              <Link
                key={m.group.id}
                href={`/community/groups/${m.group.id}`}
                className="block rounded-lg bg-white/8 px-3 py-2 hover:bg-white/15 transition-colors"
              >
                <p className="text-white text-[13px] font-medium truncate">
                  {m.group.name}
                </p>
                <p className="text-white/60 text-xs capitalize">{m.role}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-girly-purple/40 text-sm">No groups yet</p>
        )}
      </div>
    </ParticleCard>
  );
}
