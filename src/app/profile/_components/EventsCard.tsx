import { ParticleCard } from "@/components/MagicBento";
import { Calendar, CalendarDays, MapPin, Video } from "lucide-react";
import { formatDate, GLOW_COLOR, cardStyle, cardClass } from "./types";
import type { EventItem } from "./types";

interface EventsCardProps {
  title: string;
  events: EventItem[];
  emptyText: string;
}

export default function EventsCard({
  title,
  events,
  emptyText,
}: EventsCardProps) {
  return (
    <ParticleCard
      className={cardClass}
      style={cardStyle}
      glowColor={GLOW_COLOR}
      enableTilt={false}
      clickEffect
      particleCount={4}
    >
      <div className="p-2">
        <div className="flex items-center gap-2 text-white text-s mb-3">
          <Calendar className="w-4 h-4" />
          <span>{title}</span>
        </div>
        {events.length > 0 ? (
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
            {events.map((ev) => (
              <EventMini key={ev.id} event={ev} />
            ))}
          </div>
        ) : (
          <p className="text-girly-purple/40 text-sm">{emptyText}</p>
        )}
      </div>
    </ParticleCard>
  );
}

function EventMini({ event }: { event: EventItem }) {
  return (
    <div
      className={`rounded-lg bg-white/8 px-3 py-2 ${event.cancelled ? "opacity-50" : ""}`}
    >
      <p className="text-white text-[13px] font-medium truncate">
        {event.title}
        {event.cancelled && (
          <span className="ml-1.5 text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded-full">
            Cancelled
          </span>
        )}
      </p>
      <div className="flex items-center gap-3 mt-1 text-white/60 text-xs">
        <span className="flex items-center gap-1">
          <CalendarDays className="w-3 h-3" />
          {formatDate(event.date)} {event.hour}
        </span>
        <span className="flex items-center gap-1 capitalize">
          {event.modality === "remote" ? (
            <Video className="w-3 h-3" />
          ) : (
            <MapPin className="w-3 h-3" />
          )}
          {event.modality}
        </span>
      </div>
    </div>
  );
}
