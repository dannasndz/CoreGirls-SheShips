import Link from "next/link";
import { Users } from "lucide-react";
import type { GroupMembership } from "./types";

interface GroupsCardProps {
  memberships: GroupMembership[];
}

export default function GroupsCard({ memberships }: GroupsCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
      <h3 className="text-sm font-bold text-girly-purple mb-3 font-heading">
        My Groups
      </h3>

      {memberships.length > 0 ? (
        <ul className="space-y-2 text-sm text-dark-purple">
          {memberships.map((m) => (
            <li key={m.group.id}>
              <Link
                href={`/community/groups/${m.group.id}`}
                className="flex items-center gap-2 hover:text-girly-purple transition"
              >
                <Users size={16} className="text-dark-purple/50 shrink-0" />
                <span className="truncate">{m.group.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-dark-purple/40">
          No groups yet — join one in the community!
        </p>
      )}
    </div>
  );
}
