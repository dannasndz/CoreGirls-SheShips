"use client";

import { useState, useEffect } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EventData } from "./helpers";
import { useI18n } from "@/lib/i18n";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  currentUsername?: string;
  editEvent?: EventData | null;
}

type Modality = "in-person" | "remote" | "hybrid";
type OrganizerMode = "self" | "custom";

export function CreateEventModal({
  open,
  onClose,
  onSaved,
  currentUsername,
  editEvent,
}: EventModalProps) {
  const { t, locale } = useI18n();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modality, setModality] = useState<Modality>("remote");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hour, setHour] = useState("");
  const [participantsLimit, setParticipantsLimit] = useState("");
  const [organizerMode, setOrganizerMode] = useState<OrganizerMode>("self");
  const [organizerName, setOrganizerName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!editEvent;

  useEffect(() => {
    if (editEvent && open) {
      setTitle(editEvent.title);
      setDescription(editEvent.description);
      setModality(editEvent.modality as Modality);
      setLocation(editEvent.location ?? "");
      setMeetingLink(editEvent.meetingLink ?? "");
      setExternalLink(editEvent.externalLink ?? "");
      setSelectedDate(new Date(editEvent.date));
      setHour(editEvent.hour);
      setParticipantsLimit(
        editEvent.participantsLimit ? String(editEvent.participantsLimit) : ""
      );
      if (editEvent.organizerName === currentUsername) {
        setOrganizerMode("self");
        setOrganizerName("");
      } else {
        setOrganizerMode("custom");
        setOrganizerName(editEvent.organizerName);
      }
    }
  }, [editEvent, open, currentUsername]);

  if (!open) return null;

  const needsLocation = modality === "in-person" || modality === "hybrid";
  const needsLink = modality === "remote" || modality === "hybrid";
  const resolvedOrganizer =
    organizerMode === "self" ? currentUsername ?? "" : organizerName;

  const formatDate = (d: Date) =>
    d.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", { month: "short", day: "numeric", year: "numeric" });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setModality("remote");
    setLocation("");
    setMeetingLink("");
    setExternalLink("");
    setSelectedDate(undefined);
    setCalendarOpen(false);
    setHour("");
    setParticipantsLimit("");
    setOrganizerMode("self");
    setOrganizerName("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !description.trim() || !selectedDate || !hour || !resolvedOrganizer.trim()) {
      setError(t("events.errorRequired"));
      return;
    }
    if (needsLocation && !location.trim()) {
      setError(t("events.errorLocation"));
      return;
    }
    if (needsLink && !meetingLink.trim()) {
      setError(t("events.errorMeetingLink"));
      return;
    }

    setSaving(true);
    try {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      const payload = {
        title,
        description,
        modality,
        location: needsLocation ? location : null,
        meetingLink: needsLink ? meetingLink : null,
        externalLink: externalLink.trim() || null,
        date: dateStr,
        hour,
        participantsLimit: participantsLimit ? Number(participantsLimit) : null,
        organizerName: resolvedOrganizer,
      };

      const url = isEdit ? `/api/events/${editEvent.id}` : "/api/events";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        onSaved();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || t("events.errorFailed"));
      }
    } catch {
      setError(t("events.errorGeneric"));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const modalityLabels: Record<Modality, string> = {
    "in-person": t("events.inPerson"),
    remote: t("events.remote"),
    hybrid: t("events.hybrid"),
  };

  const inputClass =
    "w-full rounded-lg border border-[#E5E0D9] bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-purple/50 backdrop-blur-sm p-6"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white p-5 sm:p-6 md:p-8 shadow-xl border border-[#E5E0D9] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-girly-purple font-[family-name:var(--font-fredoka)] inline-flex items-center gap-2">
            <CalendarPlus size={22} className="text-girly-purple" />
            {isEdit ? t("events.editEvent") : t("events.createEvent")}
          </h2>
          <button
            onClick={handleClose}
            className="text-dark-purple/50 hover:text-dark-purple text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Title */}
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("events.eventTitle")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("events.eventTitlePlaceholder")}
              className={inputClass}
              required
            />
          </div>

          {/* Row 2: Description */}
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("events.description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("events.descriptionPlaceholder")}
              rows={3}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          {/* Row 3: Modality + Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-2">
                {t("events.modality")}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["in-person", "remote", "hybrid"] as Modality[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModality(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${modality === m
                        ? "bg-girly-purple text-white"
                        : "bg-girly-purple/10 text-strong-purple hover:bg-girly-purple/20"
                      }`}
                  >
                    {modalityLabels[m]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              {needsLink && (
                <>
                  <label className="block text-sm font-medium text-dark-purple mb-1">
                    {t("events.meetingLinkLabel")}
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder={t("events.meetingLinkPlaceholder")}
                    className={inputClass}
                  />
                </>
              )}
              {needsLocation && !needsLink && (
                <>
                  <label className="block text-sm font-medium text-dark-purple mb-1">
                    {t("events.locationLabel")}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t("events.locationPlaceholder")}
                    className={inputClass}
                  />
                </>
              )}
            </div>
          </div>

          {/* Extra location row for hybrid */}
          {needsLocation && needsLink && (
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("events.locationLabel")}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("events.locationPlaceholder")}
                className={inputClass}
              />
            </div>
          )}

          {/* Row 4: Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("events.dateLabel")}
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`${inputClass} text-left cursor-pointer flex items-center justify-between`}
                  >
                    <span className={selectedDate ? "" : "text-dark-purple/40"}>
                      {selectedDate
                        ? formatDate(selectedDate)
                        : t("events.selectDate")}
                    </span>
                    <ChevronDown size={14} className="text-dark-purple/40" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[200]" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    defaultMonth={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }}
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("events.timeLabel")}
              </label>
              <Input
                type="time"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="rounded-lg border-[#E5E0D9] bg-cream text-dark-purple focus-visible:ring-girly-purple/50 focus-visible:border-girly-purple h-[38px] appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                required
              />
            </div>
          </div>

          {/* Row 5: Organizer + Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-2">
                {t("events.organizerLabel")}
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setOrganizerMode("self")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${organizerMode === "self"
                      ? "bg-girly-purple text-white"
                      : "bg-girly-purple/10 text-strong-purple hover:bg-girly-purple/20"
                    }`}
                >
                  {t("events.myself")}
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setOrganizerMode("custom")}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${organizerMode === "custom"
                          ? "bg-girly-purple text-white"
                          : "bg-girly-purple/10 text-strong-purple hover:bg-girly-purple/20"
                        }`}
                    >
                      {organizerMode === "custom" && organizerName
                        ? organizerName
                        : t("events.custom")}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3 z-[200]" align="start">
                    <label className="block text-xs font-medium text-dark-purple mb-1.5">
                      {t("events.organizerNameLabel")}
                    </label>
                    <input
                      type="text"
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      placeholder={t("events.organizerNamePlaceholder")}
                      className={inputClass}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("events.participantsLimit")}
              </label>
              <input
                type="number"
                min="1"
                value={participantsLimit}
                onChange={(e) => setParticipantsLimit(e.target.value)}
                placeholder={t("events.unlimited")}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 6: External Link */}
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("events.externalLink")}
            </label>
            <input
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder={t("events.externalLinkPlaceholder")}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2 border-t border-[#E5E0D9]/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm text-dark-purple/60 hover:bg-light-pink/30 transition"
            >
              {t("events.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
            >
              {saving ? t("events.saving") : isEdit ? t("events.saveChanges") : t("events.createEvent")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
