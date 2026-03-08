"use client";

import { CalendarDays, Clock } from "lucide-react";
import { EventData, formatEventDate } from "./helpers";
import { useI18n } from "@/lib/i18n";

interface RightSidebarProps {
  tags: string[];
  upcomingEvents: EventData[];
  onViewAllEvents: () => void;
}

export function RightSidebar({ tags, upcomingEvents, onViewAllEvents }: RightSidebarProps) {
  const { t } = useI18n();

  return (
    <aside className="space-y-6">
      {/* Trending Topics */}
      <div className="rounded-2xl bg-white border border-[#E5E0D9] p-4 shadow-sm">
        <h3 className="text-sm font-bold text-girly-purple mb-3 font-[family-name:var(--font-fredoka)]">
          {t("rightSidebar.trendingTopics")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-dark-purple font-medium hover:text-girly-purple cursor-pointer transition"
              >
                #{tag}
              </span>
            ))
          ) : (
            <p className="text-xs text-dark-purple/40">
              {t("rightSidebar.noTags")}
            </p>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E5E0D9]">
        <div className="bg-gradient-to-br from-girly-purple to-light-pink p-4 text-white">
          <h3 className="text-sm font-bold font-[family-name:var(--font-fredoka)] mb-2">
            {t("rightSidebar.upcomingEvents")}
          </h3>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="bg-white/15 rounded-lg p-2.5">
                  <p className="text-xs font-semibold truncate">{event.title}</p>
                  <div className="flex gap-3 mt-1 text-[10px] text-white/80">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={10} />
                      {formatEventDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {event.hour}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/70">{t("rightSidebar.noUpcomingEvents")}</p>
          )}
        </div>
        <div className="bg-white p-3 text-center">
          <button
            onClick={onViewAllEvents}
            className="text-sm text-girly-purple font-medium hover:underline"
          >
            {t("rightSidebar.seeAllEvents")}
          </button>
        </div>
      </div>
    </aside>
  );
}
