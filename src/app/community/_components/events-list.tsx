"use client";

import { useState } from "react";
import {
  Plus,
  MapPin,
  Video,
  Clock,
  CalendarDays,
  Users,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { EventData, formatEventDate } from "./helpers";

interface EventsListProps {
  events: EventData[];
  loading: boolean;
  onCreateEvent: () => void;
  onAttend: (eventId: string) => Promise<void>;
  onShareToForum: (event: EventData) => void;
  onEdit: (event: EventData) => void;
  onCancel: (eventId: string) => Promise<void>;
  attendingIds: Set<string>;
  currentUserId?: string;
}

const modalityLabel: Record<string, string> = {
  "in-person": "In Person",
  remote: "Remote",
  hybrid: "Hybrid",
};

const modalityColor: Record<string, string> = {
  "in-person": "bg-cute-orange/10 text-cute-orange",
  remote: "bg-girly-purple/10 text-girly-purple",
  hybrid: "bg-strong-purple/10 text-strong-purple",
};

export function EventsList({
  events,
  loading,
  onCreateEvent,
  onAttend,
  onShareToForum,
  onEdit,
  onCancel,
  attendingIds,
  currentUserId,
}: EventsListProps) {
  const [loadingAttend, setLoadingAttend] = useState<string | null>(null);
  const [loadingCancel, setLoadingCancel] = useState<string | null>(null);

  const handleAttend = async (eventId: string) => {
    setLoadingAttend(eventId);
    await onAttend(eventId);
    setLoadingAttend(null);
  };

  const handleCancel = async (eventId: string) => {
    setLoadingCancel(eventId);
    await onCancel(eventId);
    setLoadingCancel(null);
  };

  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  const past = events.filter((e) => new Date(e.date) < new Date());

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-dark-purple font-[family-name:var(--font-fredoka)]">
          Events
        </h2>
        <button
          onClick={onCreateEvent}
          className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-girly-purple text-girly-purple font-semibold text-sm hover:bg-girly-purple hover:text-white transition"
        >
          <Plus size={16} />
          New Event
        </button>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white border border-light-pink p-8 shadow-sm text-center">
          <p className="text-girly-purple text-sm font-medium animate-pulse">
            Loading events...
          </p>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="rounded-2xl bg-white border border-light-pink p-8 shadow-sm text-center">
          <p className="text-dark-purple/50 text-sm">
            No events yet. Create the first one!
          </p>
        </div>
      )}

      {upcoming.length > 0 && (
        <>
          <p className="text-xs font-semibold text-dark-purple/50 uppercase tracking-wide">
            Upcoming
          </p>
          {upcoming.map((event) => {
            const isAttending = attendingIds.has(event.id);
            const isFull =
              event.participantsLimit !== null &&
              event._count.attendees >= event.participantsLimit;

            return (
              <div
                key={event.id}
                className="rounded-2xl bg-white border border-light-pink p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-dark-purple">
                        {event.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${modalityColor[event.modality] ?? ""}`}
                      >
                        {modalityLabel[event.modality] ?? event.modality}
                      </span>
                      {event.cancelled && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                          Cancelled
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${event.cancelled ? "text-dark-purple/40 line-through" : "text-dark-purple/70"}`}>
                      {event.description}
                    </p>
                  </div>
                  {currentUserId === event.createdBy.id && (
                    <button
                      onClick={() => onEdit(event)}
                      className="p-1.5 rounded-lg text-dark-purple/40 hover:text-girly-purple hover:bg-light-pink/30 transition shrink-0"
                      title="Edit event"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-dark-purple/60">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {formatEventDate(event.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {event.hour}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {event.location}
                    </span>
                  )}
                  {event.meetingLink && (
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-girly-purple hover:underline"
                    >
                      <Video size={14} />
                      Join online
                      <ExternalLink size={10} />
                    </a>
                  )}
                  {event.externalLink && (
                    <a
                      href={event.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-girly-purple hover:underline"
                    >
                      <ExternalLink size={14} />
                      More info
                    </a>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {event._count.attendees}
                    {event.participantsLimit
                      ? ` / ${event.participantsLimit}`
                      : ""}{" "}
                    attending
                  </span>
                </div>

                <p className="text-xs text-dark-purple/40">
                  Organized by {event.organizerName}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-light-pink/50">
                  {!event.cancelled && (
                    <button
                      onClick={() => handleAttend(event.id)}
                      disabled={
                        loadingAttend === event.id ||
                        (!isAttending && isFull)
                      }
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                        isAttending
                          ? "border-2 border-light-pink text-dark-purple/60 hover:border-hot-pink hover:text-hot-pink"
                          : isFull
                            ? "bg-light-pink/30 text-dark-purple/40"
                            : "bg-girly-purple text-white hover:bg-strong-purple"
                      }`}
                    >
                      {loadingAttend === event.id
                        ? "..."
                        : isAttending
                          ? "Cancel RSVP"
                          : isFull
                            ? "Event Full"
                            : "Attend"}
                    </button>
                  )}
                  {currentUserId && !event.cancelled && (
                    <button
                      onClick={() => onShareToForum(event)}
                      className="px-4 py-1.5 rounded-full text-sm font-medium border border-light-pink text-dark-purple/60 hover:border-girly-purple hover:text-girly-purple transition"
                    >
                      Share to Forum
                    </button>
                  )}
                  {currentUserId === event.createdBy.id && (
                    <button
                      onClick={() => handleCancel(event.id)}
                      disabled={loadingCancel === event.id}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        event.cancelled
                          ? "border border-green-300 text-green-600 hover:bg-green-50"
                          : "border border-red-200 text-red-500 hover:bg-red-50"
                      }`}
                    >
                      {loadingCancel === event.id
                        ? "..."
                        : event.cancelled
                          ? "Reactivate Event"
                          : "Cancel Event"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {past.length > 0 && (
        <>
          <p className="text-xs font-semibold text-dark-purple/50 uppercase tracking-wide mt-4">
            Past Events
          </p>
          {past.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl bg-white/60 border border-light-pink/50 p-5 shadow-sm space-y-2 opacity-70"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-dark-purple">
                    {event.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${modalityColor[event.modality] ?? ""}`}
                  >
                    {modalityLabel[event.modality] ?? event.modality}
                  </span>
                  {event.cancelled && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                      Cancelled
                    </span>
                  )}
                </div>
                {currentUserId === event.createdBy.id && (
                  <button
                    onClick={() => onEdit(event)}
                    className="p-1.5 rounded-lg text-dark-purple/40 hover:text-girly-purple hover:bg-light-pink/30 transition shrink-0"
                    title="Edit event"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>
              <div className="flex gap-4 text-xs text-dark-purple/40">
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />
                  {formatEventDate(event.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {event._count.attendees} attended
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
