import { CalendarDays, Clock } from "lucide-react";
import { formatDate } from "./types";
import type { EventItem } from "./types";

interface EventsCardProps {
  title: string;
  events: EventItem[];
  emptyText: string;
  gradient?: boolean;
}

export default function EventsCard({
  title,
  events,
  emptyText,
  gradient = false,
}: EventsCardProps) {
  if (gradient) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-sm border border-light-pink">
        <div className="bg-linear-to-br from-girly-purple to-light-pink p-4 text-white">
          <h3 className="text-sm font-bold font-heading mb-2">
            {title}
          </h3>
          {events.length > 0 ? (
            <div className="space-y-2">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="bg-white/15 rounded-lg p-2.5">
                  <p className="text-xs font-semibold truncate">
                    {ev.title}
                    {ev.cancelled && (
                      <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                        Cancelled
                      </span>
                    )}
                  </p>
                  <div className="flex gap-3 mt-1 text-[10px] text-white/80">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={10} />
                      {formatDate(ev.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {ev.hour}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/70">{emptyText}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
      <h3 className="text-sm font-bold text-girly-purple mb-3 font-heading">
        {title}
      </h3>

      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`rounded-lg px-3 py-2 ${ev.cancelled ? "opacity-50" : ""}`}
            >
              <p className="text-sm text-dark-purple font-medium truncate">
                {ev.title}
                {ev.cancelled && (
                  <span className="ml-1.5 text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full font-bold">
                    Cancelled
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-dark-purple/40">
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />
                  {formatDate(ev.date)} {ev.hour}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-dark-purple/40">{emptyText}</p>
      )}
    </div>
  );
}
