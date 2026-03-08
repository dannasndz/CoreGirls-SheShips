"use client";

import { useState, useEffect } from "react";
import { EventData } from "./helpers";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modality, setModality] = useState<Modality>("remote");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [participantsLimit, setParticipantsLimit] = useState("");
  const [organizerMode, setOrganizerMode] = useState<OrganizerMode>("self");
  const [organizerName, setOrganizerName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!editEvent;

  // Pre-fill when editing
  useEffect(() => {
    if (editEvent && open) {
      setTitle(editEvent.title);
      setDescription(editEvent.description);
      setModality(editEvent.modality as Modality);
      setLocation(editEvent.location ?? "");
      setMeetingLink(editEvent.meetingLink ?? "");
      setExternalLink(editEvent.externalLink ?? "");
      setDate(editEvent.date.slice(0, 10)); // "YYYY-MM-DD"
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

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setModality("remote");
    setLocation("");
    setMeetingLink("");
    setExternalLink("");
    setDate("");
    setHour("");
    setParticipantsLimit("");
    setOrganizerMode("self");
    setOrganizerName("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      !title.trim() ||
      !description.trim() ||
      !date ||
      !hour ||
      !resolvedOrganizer.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (needsLocation && !location.trim()) {
      setError("Location is required for in-person/hybrid events.");
      return;
    }
    if (needsLink && !meetingLink.trim()) {
      setError("Meeting link is required for remote/hybrid events.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        description,
        modality,
        location: needsLocation ? location : null,
        meetingLink: needsLink ? meetingLink : null,
        externalLink: externalLink.trim() || null,
        date,
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
        setError(data.error || "Failed to save event");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-purple/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-4 rounded-2xl bg-white p-6 shadow-xl border border-light-pink max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-girly-purple font-[family-name:var(--font-fredoka)]">
            {isEdit ? "Edit Event" : "Create an Event"}
          </h2>
          <button
            onClick={handleClose}
            className="text-dark-purple/50 hover:text-dark-purple text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-purple mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Women in AI Workshop"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-purple mb-1">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this event about?"
                  rows={3}
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-purple mb-2">
                  Modality *
                </label>
                <div className="flex gap-2">
                  {(["in-person", "remote", "hybrid"] as Modality[]).map(
                    (m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModality(m)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          modality === m
                            ? "bg-girly-purple text-white"
                            : "bg-light-pink/30 text-dark-purple hover:bg-light-pink/50"
                        }`}
                      >
                        {m === "in-person"
                          ? "In Person"
                          : m === "remote"
                            ? "Remote"
                            : "Hybrid"}
                      </button>
                    )
                  )}
                </div>
              </div>

              {needsLocation && (
                <div>
                  <label className="block text-sm font-medium text-dark-purple mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. 123 Main St, City"
                    className={inputClass}
                  />
                </div>
              )}

              {needsLink && (
                <div>
                  <label className="block text-sm font-medium text-dark-purple mb-1">
                    Meeting Link *
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="e.g. https://zoom.us/j/..."
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-purple mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-purple mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-purple mb-1">
                  Participants Limit (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={participantsLimit}
                  onChange={(e) => setParticipantsLimit(e.target.value)}
                  placeholder="Leave empty for unlimited"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-purple mb-2">
                  Organizer *
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setOrganizerMode("self")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      organizerMode === "self"
                        ? "bg-girly-purple text-white"
                        : "bg-light-pink/30 text-dark-purple hover:bg-light-pink/50"
                    }`}
                  >
                    Myself ({currentUsername})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrganizerMode("custom")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      organizerMode === "custom"
                        ? "bg-girly-purple text-white"
                        : "bg-light-pink/30 text-dark-purple hover:bg-light-pink/50"
                    }`}
                  >
                    Someone else
                  </button>
                </div>
                {organizerMode === "custom" && (
                  <input
                    type="text"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="e.g. SheShips Community"
                    className={inputClass}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-purple mb-1">
                  External Info Link (optional)
                </label>
                <input
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="e.g. https://eventbrite.com/..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <div className="flex gap-2 justify-end pt-2 border-t border-light-pink/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm text-dark-purple/60 hover:bg-light-pink/30 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
