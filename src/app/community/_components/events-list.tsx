"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  MapPin,
  Video,
  Clock,
  CalendarDays,
  Users,
  ExternalLink,
  Pencil,
  MoreHorizontal,
  Ban,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { EventData, formatEventDate } from "./helpers";
import { UserAvatar } from "./user-avatar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useI18n } from "@/lib/i18n";
import {
  countActiveFilters,
  filterEvents,
  isCancelled,
  isPast,
} from "@/lib/events-filter";

interface EventsListProps {
  events: EventData[];
  loading: boolean;
  canCreate?: boolean;
  onCreateEvent: () => void;
  onAttend: (eventId: string) => Promise<void>;
  onEdit: (event: EventData) => void;
  onCancel: (eventId: string) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
  attendingIds: Set<string>;
  currentUserId?: string;
}

function EventMenu({
  event,
  onEdit,
  onCancel,
  onDelete,
  cancelling,
}: {
  event: EventData;
  onEdit: (event: EventData) => void;
  onCancel: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  cancelling: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const item =
    "flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition hover:bg-light-pink/30";

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-dark-purple/40 hover:text-girly-purple hover:bg-light-pink/30 transition"
        aria-label={t("post.options")}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 z-30 w-44 rounded-xl border border-[#E5E0D9] bg-white shadow-lg overflow-hidden">
          <button
            type="button"
            className={item}
            onClick={() => {
              setOpen(false);
              onEdit(event);
            }}
          >
            <Pencil size={14} />
            {t("events.editEvent")}
          </button>
          <button
            type="button"
            className={`${item} ${
              event.estado === "CANCELADO" ? "text-green-600" : "text-cute-orange"
            }`}
            disabled={cancelling}
            onClick={() => {
              setOpen(false);
              onCancel(event.id);
            }}
          >
            {event.estado === "CANCELADO" ? (
              <>
                <RotateCcw size={14} />
                {t("events.reactivateEvent")}
              </>
            ) : (
              <>
                <Ban size={14} />
                {t("events.cancelEvent")}
              </>
            )}
          </button>
          <button
            type="button"
            className={`${item} text-red-600`}
            onClick={() => {
              setOpen(false);
              onDelete(event.id);
            }}
          >
            <Trash2 size={14} />
            {t("events.deleteEvent")}
          </button>
        </div>
      )}
    </div>
  );
}

export function EventsList({
  events,
  loading,
  canCreate = true,
  onCreateEvent,
  onAttend,
  onEdit,
  onCancel,
  onDelete,
  attendingIds,
  currentUserId,
}: EventsListProps) {
  const { t, locale } = useI18n();
  const [loadingAttend, setLoadingAttend] = useState<string | null>(null);
  const [loadingCancel, setLoadingCancel] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const modalityLabel: Record<string, string> = {
    "in-person": t("events.inPerson"),
    remote: t("events.remote"),
    hybrid: t("events.hybrid"),
  };

  const modalityColor: Record<string, string> = {
    "in-person": "bg-cute-orange/10 text-cute-orange",
    remote: "bg-girly-purple/10 text-girly-purple",
    hybrid: "bg-strong-purple/10 text-strong-purple",
  };

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

  const handleDelete = async (eventId: string) => {
    setLoadingDelete(eventId);
    await onDelete(eventId);
    setLoadingDelete(null);
    setConfirmDeleteId(null);
  };

  // ---- Filtros ----
  const [modalityFilter, setModalityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filters = {
    modality: modalityFilter,
    status: statusFilter,
    dateFrom,
    dateTo,
  };
  const activeFilterCount = countActiveFilters(filters);
  const filtered = filterEvents(events, filters);

  const filteredUpcoming = filtered.filter(
    (e) => !isCancelled(e) && !isPast(e)
  );
  const filteredPast = filtered.filter((e) => !isCancelled(e) && isPast(e));
  const filteredCancelled = filtered.filter(isCancelled);

  const toggleModality = (value: string) => {
    setModalityFilter((prev) =>
      prev.includes(value)
        ? prev.filter((m) => m !== value)
        : [...prev, value]
    );
  };

  const clearFilters = () => {
    setModalityFilter([]);
    setStatusFilter(null);
    setDateFrom("");
    setDateTo("");
  };

  const chipClass = (active: boolean) =>
    `px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
      active
        ? "bg-girly-purple text-white"
        : "bg-white border border-[#E5E0D9] text-dark-purple hover:text-hot-pink hover:bg-light-pink/20"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-dark-purple font-[family-name:var(--font-fredoka)]">
          {t("events.title")}
        </h2>
        {canCreate && (
          <button
            onClick={onCreateEvent}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-girly-purple text-girly-purple font-semibold text-sm hover:bg-girly-purple hover:text-white transition"
          >
            <Plus size={16} />
            {t("events.newEvent")}
          </button>
        )}
      </div>

      {loading && (
        <div className="rounded-2xl bg-white border border-[#E5E0D9] p-8 shadow-sm text-center">
          <p className="text-girly-purple text-sm font-medium animate-pulse">
            {t("events.loadingEvents")}
          </p>
        </div>
      )}

      {!loading && (
        <div className="rounded-2xl bg-white border border-[#E5E0D9] p-3 sm:p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-purple/50 mr-1 w-full sm:w-auto">
              {t("events.filterModality")}
            </span>
            {[
              { key: "in-person", label: t("events.inPerson") },
              { key: "remote", label: t("events.remote") },
              { key: "hybrid", label: t("events.hybrid") },
            ].map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => toggleModality(m.key)}
                className={chipClass(modalityFilter.includes(m.key))}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-purple/50 mr-1 w-full sm:w-auto">
              {t("events.filterStatus")}
            </span>
            {[
              { key: "upcoming", label: t("events.upcoming") },
              { key: "past", label: t("events.pastEvents") },
              { key: "cancelled", label: t("events.cancelled") },
            ].map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() =>
                  setStatusFilter((prev) => (prev === s.key ? null : s.key))
                }
                className={chipClass(statusFilter === s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-dark-purple/50 mr-1 w-full sm:w-auto">
              {t("events.filterDates")}
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-[#E5E0D9] bg-cream px-3 py-1.5 text-sm text-dark-purple focus:outline-none focus:ring-2 focus:ring-girly-purple"
            />
            <span className="text-dark-purple/40 text-sm">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-[#E5E0D9] bg-cream px-3 py-1.5 text-sm text-dark-purple focus:outline-none focus:ring-2 focus:ring-girly-purple"
            />
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-1 rounded-full text-xs font-semibold border border-hot-pink text-hot-pink hover:bg-light-pink/20 transition"
              >
                {t("events.clearFilters")} ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="rounded-2xl bg-white border border-[#E5E0D9] p-8 shadow-sm text-center">
          <p className="text-dark-purple/50 text-sm">
            {t("events.noEvents")}
          </p>
        </div>
      )}

      {!loading && events.length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl bg-white border border-[#E5E0D9] p-8 shadow-sm text-center">
          <p className="text-dark-purple/50 text-sm">
            {t("events.noFilteredEvents")}
          </p>
        </div>
      )}

      {filteredUpcoming.length > 0 && (
        <>
          <p className="text-sm font-semibold text-dark-purple/50 uppercase tracking-wide">
            {t("events.upcoming")}
          </p>
          {filteredUpcoming.map((event) => {
            const isAttending = attendingIds.has(event.id);
            const isFull =
              event.participantsLimit !== null &&
              event._count.attendees >= event.participantsLimit;
            const isCreator = currentUserId === event.createdBy.id;

            return (
              <div
                key={event.id}
                className="rounded-2xl bg-white border border-[#E5E0D9] p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-dark-purple">
                        {event.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-sm font-semibold ${modalityColor[event.modality] ?? ""}`}
                      >
                        {modalityLabel[event.modality] ?? event.modality}
                      </span>
                      {event.estado === "CANCELADO" && (
                        <span className="px-2.5 py-0.5 rounded-full text-sm font-semibold bg-red-100 text-red-600">
                          {t("events.cancelled")}
                        </span>
                      )}
                    </div>
                    <p className={`text-lg ${event.estado === "CANCELADO" ? "text-dark-purple/50" : "text-dark-purple/70"}`}>
                      {event.description}
                    </p>
                    <Link
                      href={`/profile/${event.createdBy.id}`}
                      className="inline-flex items-center gap-2 text-sm text-dark-purple/40 hover:text-girly-purple transition"
                    >
                      <UserAvatar user={event.createdBy} size={22} linked={false} />
                      {t("events.organizedBy", { name: event.organizerName })}
                    </Link>
                  </div>
                  {isCreator && (
                    <EventMenu
                      event={event}
                      onEdit={onEdit}
                      onCancel={handleCancel}
                      onDelete={setConfirmDeleteId}
                      cancelling={loadingCancel === event.id}
                    />
                  )}
                </div>

                {event.imageUrl && (
                  <span className="relative block h-44 w-full rounded-xl overflow-hidden bg-cream">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </span>
                )}

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-dark-purple/60">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {formatEventDate(event.date, locale)}
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
                      {t("events.joinOnline")}
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
                      {t("events.moreInfo")}
                    </a>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {event._count.attendees}
                    {event.participantsLimit
                      ? ` / ${event.participantsLimit}`
                      : ""}{" "}
                    {t("events.attending")}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E0D9]/50">
                  {event.estado !== "CANCELADO" && !isCreator && (
                    <button
                      onClick={() => handleAttend(event.id)}
                      disabled={
                        loadingAttend === event.id ||
                        (!isAttending && isFull)
                      }
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                        isAttending
                          ? "border-2 border-[#E5E0D9] text-dark-purple/60 hover:border-hot-pink hover:text-hot-pink"
                          : isFull
                            ? "bg-light-pink/30 text-dark-purple/40"
                            : "bg-girly-purple text-white hover:bg-strong-purple"
                      }`}
                    >
                      {loadingAttend === event.id
                        ? "..."
                        : isAttending
                          ? t("events.cancelRSVP")
                          : isFull
                            ? t("events.eventFull")
                            : t("events.attend")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {filteredPast.length > 0 && (
        <>
          <p className="text-sm font-semibold text-dark-purple/50 uppercase tracking-wide mt-8">
            {t("events.pastEvents")}
          </p>
          {filteredPast.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl bg-white/60 border border-[#E5E0D9]/50 p-5 shadow-sm space-y-2 opacity-70"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-dark-purple">
                    {event.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-semibold ${modalityColor[event.modality] ?? ""}`}
                  >
                    {modalityLabel[event.modality] ?? event.modality}
                  </span>
                </div>
                {currentUserId === event.createdBy.id && (
                  <EventMenu
                    event={event}
                    onEdit={onEdit}
                    onCancel={handleCancel}
                    onDelete={setConfirmDeleteId}
                    cancelling={loadingCancel === event.id}
                  />
                )}
              </div>
              <div className="flex gap-4 text-sm text-dark-purple/40">
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />
                  {formatEventDate(event.date, locale)}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {event._count.attendees} {t("events.attended")}
                </span>
              </div>
            </div>
          ))}
        </>
      )}

      {filteredCancelled.length > 0 && (
        <>
          <p className="text-sm font-semibold text-dark-purple/50 uppercase tracking-wide mt-8">
            {t("events.cancelled")}
          </p>
          {filteredCancelled.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl bg-white border border-[#E5E0D9] p-5 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-dark-purple">
                    {event.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-semibold ${modalityColor[event.modality] ?? ""}`}
                  >
                    {modalityLabel[event.modality] ?? event.modality}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-sm font-semibold bg-red-100 text-red-600">
                    {t("events.cancelled")}
                  </span>
                </div>
                {currentUserId === event.createdBy.id && (
                  <EventMenu
                    event={event}
                    onEdit={onEdit}
                    onCancel={handleCancel}
                    onDelete={setConfirmDeleteId}
                    cancelling={loadingCancel === event.id}
                  />
                )}
              </div>
              <div className="flex gap-4 text-sm text-dark-purple/40">
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />
                  {formatEventDate(event.date, locale)}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {event._count.attendees} {t("events.attended")}
                </span>
              </div>
            </div>
          ))}
        </>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title={t("events.deleteEvent")}
        message={t("events.confirmDelete")}
        confirmLabel={t("events.deleteEvent")}
        busy={loadingDelete !== null}
        onConfirm={() => {
          if (confirmDeleteId) handleDelete(confirmDeleteId);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
