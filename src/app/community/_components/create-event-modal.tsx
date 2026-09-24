"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CalendarPlus, ChevronDown, ImagePlus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EventData } from "./helpers";
import { useI18n } from "@/lib/i18n";
import { uploadFile } from "@/lib/blob-upload";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  currentUsername?: string;
  currentUserId?: string;
  editEvent?: EventData | null;
}

type Modality = "in-person" | "remote" | "hybrid";
type OrganizerMode = "self" | "custom";
type Estado = "BORRADOR" | "PUBLICADO";

export function CreateEventModal({
  open,
  onClose,
  onSaved,
  currentUsername,
  currentUserId,
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
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [estado, setEstado] = useState<Estado>("PUBLICADO");
  const [organizerMode, setOrganizerMode] = useState<OrganizerMode>("self");
  const [organizerName, setOrganizerName] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState("");
  const initialSnapshotRef = useRef<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = !!editEvent;

  const buildSnapshot = () =>
    JSON.stringify({
      title,
      description,
      modality,
      location,
      meetingLink,
      externalLink,
      date: selectedDate ? selectedDate.toISOString().slice(0, 10) : "",
      hour,
      participantsLimit,
      imageUrl,
      estado,
      organizerName: organizerMode === "self" ? "" : organizerName,
    });

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
      setImageUrl(editEvent.imageUrl ?? "");
      setEstado(
        editEvent.estado === "BORRADOR" ? "BORRADOR" : "PUBLICADO"
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

  // Al crear (sin edición), precarga el último borrador guardado de la usuaria.
  useEffect(() => {
    if (!open || editEvent) return;
    let active = true;
    const emptySnapshot = JSON.stringify({
      title: "",
      description: "",
      modality: "remote",
      location: "",
      meetingLink: "",
      externalLink: "",
      date: "",
      hour: "",
      participantsLimit: "",
      imageUrl: "",
      estado: "PUBLICADO",
      organizerName: "",
    });
    (async () => {
      try {
        const res = await fetch("/api/events/draft");
        const data = await res.json();
        const draft = data?.data as EventData | null;
        if (!active) return;
        if (!draft) {
          resetForm();
          initialSnapshotRef.current = emptySnapshot;
          return;
        }
        setTitle(draft.title ?? "");
        setDescription(draft.description ?? "");
        setModality((draft.modality as Modality) ?? "remote");
        setLocation(draft.location ?? "");
        setMeetingLink(draft.meetingLink ?? "");
        setExternalLink(draft.externalLink ?? "");
        setSelectedDate(draft.date ? new Date(draft.date) : undefined);
        setHour(draft.hour ?? "");
        setParticipantsLimit(
          draft.participantsLimit ? String(draft.participantsLimit) : ""
        );
        setImageUrl(draft.imageUrl ?? "");
        setEstado("BORRADOR");
        if (draft.organizerName && draft.organizerName !== currentUsername) {
          setOrganizerMode("custom");
          setOrganizerName(draft.organizerName);
        }
        // La instantánea refleja el borrador recién cargado (sin cambios).
        initialSnapshotRef.current = JSON.stringify({
          title: draft.title ?? "",
          description: draft.description ?? "",
          modality: (draft.modality as Modality) ?? "remote",
          location: draft.location ?? "",
          meetingLink: draft.meetingLink ?? "",
          externalLink: draft.externalLink ?? "",
          date: draft.date ? new Date(draft.date).toISOString().slice(0, 10) : "",
          hour: draft.hour ?? "",
          participantsLimit: draft.participantsLimit
            ? String(draft.participantsLimit)
            : "",
          imageUrl: draft.imageUrl ?? "",
          estado: "BORRADOR",
          organizerName:
            draft.organizerName && draft.organizerName !== currentUsername
              ? draft.organizerName
              : "",
        });
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, [open, editEvent, currentUsername]);

  // Guarda la instantánea inicial del formulario para detectar cambios sin guardar.
  useEffect(() => {
    if (!open) return;
    if (!editEvent) return;
    const id = setTimeout(() => {
      initialSnapshotRef.current = JSON.stringify({
        title: editEvent.title,
        description: editEvent.description,
        modality: editEvent.modality,
        location: editEvent.location ?? "",
        meetingLink: editEvent.meetingLink ?? "",
        externalLink: editEvent.externalLink ?? "",
        date: new Date(editEvent.date).toISOString().slice(0, 10),
        hour: editEvent.hour,
        participantsLimit: editEvent.participantsLimit
          ? String(editEvent.participantsLimit)
          : "",
        imageUrl: editEvent.imageUrl ?? "",
        estado: editEvent.estado === "BORRADOR" ? "BORRADOR" : "PUBLICADO",
        organizerName:
          editEvent.organizerName === currentUsername
            ? ""
            : editEvent.organizerName,
      });
    }, 0);
    return () => clearTimeout(id);
  }, [open, editEvent, currentUsername]);

  if (!open) return null;

  const isDirty = buildSnapshot() !== initialSnapshotRef.current;
  const isPublished = editEvent?.estado === "PUBLICADO";

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
    setImageUrl("");
    setEstado("PUBLICADO");
    setOrganizerMode("self");
    setOrganizerName("");
    setShowCancelConfirm(false);
    setError("");
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !currentUserId) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadFile(files[0], {
        userId: currentUserId,
        category: "images",
      });
      setImageUrl(url);
    } catch {
      setError(t("events.errorImage"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent, estadoToSave: Estado) => {
    e.preventDefault();
    setError("");

    const isPublish = estadoToSave === "PUBLICADO";

    if (isPublish) {
      // Para publicar se requieren todos los campos obligatorios.
      if (!title.trim() || !description.trim() || !selectedDate || !hour || !participantsLimit) {
        setError(t("events.errorRequired"));
        return;
      }
      // El lugar es obligatorio salvo en eventos virtuales.
      if (needsLocation && !location.trim()) {
        setError(t("events.errorLocation"));
        return;
      }
      if (needsLink && !meetingLink.trim()) {
        setError(t("events.errorMeetingLink"));
        return;
      }
      // No se puede publicar con fecha/hora en el pasado.
      const start = new Date(
        `${selectedDate.toISOString().slice(0, 10)}T${hour || "00:00"}:00`
      );
      if (!isNaN(start.getTime()) && start.getTime() < Date.now()) {
        setError(t("events.errorPastDate"));
        return;
      }
    } else if (
      !title.trim() &&
      !description.trim() &&
      !location.trim() &&
      !selectedDate &&
      !participantsLimit &&
      !imageUrl
    ) {
      // Para un borrador basta con al menos un dato.
      setError(t("events.errorDraftEmpty"));
      return;
    }

    setSaving(true);
    setEstado(estadoToSave);
    try {
      const dateStr = selectedDate ? selectedDate.toISOString().slice(0, 10) : null;
      const payload = {
        title,
        description,
        modality,
        location,
        meetingLink: meetingLink.trim() || null,
        externalLink: externalLink.trim() || null,
        date: dateStr,
        hour,
        participantsLimit: participantsLimit ? Number(participantsLimit) : null,
        imageUrl: imageUrl || null,
        organizerName: resolvedOrganizer,
        estado: estadoToSave,
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
    // Si hay cambios sin guardar, pide confirmación antes de cerrar.
    if (isDirty) {
      setShowCancelConfirm(true);
      return;
    }
    resetForm();
    onClose();
  };

  const handleBackdrop = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
      return;
    }
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
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-6"
      onClick={handleBackdrop}
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e, "PUBLICADO");
          }}
          className="space-y-4"
        >
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
                placeholder="10"
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 5c: Photo */}
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-2">
              {t("events.photo")}
            </label>
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <span className="relative h-20 w-20 rounded-lg overflow-hidden bg-cream shrink-0">
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-1 right-1 rounded-full bg-dark-purple/60 text-white p-0.5 hover:bg-hot-pink"
                  >
                    <X size={12} />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-20 w-20 rounded-lg border-2 border-dashed border-[#E5E0D9] text-dark-purple/40 hover:border-girly-purple hover:text-girly-purple transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                >
                  <ImagePlus size={18} />
                  <span className="text-[10px]">
                    {uploading ? t("events.uploading") : t("events.addPhoto")}
                  </span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
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
          <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-[#E5E0D9]/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm text-dark-purple/60 hover:bg-light-pink/30 transition"
            >
              {t("events.cancel")}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "PUBLICADO")}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
            >
              {saving && estado === "PUBLICADO"
                ? t("events.saving")
                : isEdit
                  ? t("events.saveChanges")
                  : t("events.createEvent")}
            </button>
          </div>
        </form>
      </div>

      {showCancelConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-sm p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-[#E5E0D9]">
            <h3 className="text-lg font-bold text-dark-purple mb-2 font-[family-name:var(--font-fredoka)]">
              {t("events.cancelConfirmTitle")}
            </h3>
            <p className="text-sm text-dark-purple/60 mb-5">
              {t("events.cancelConfirmText")}
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm text-dark-purple/60 hover:bg-light-pink/30 transition"
              >
                {t("events.keepEditing")}
              </button>
              {!isPublished && (
                <button
                  type="button"
                  onClick={(e) => {
                    setShowCancelConfirm(false);
                    handleSubmit(e as unknown as React.FormEvent, "BORRADOR");
                  }}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg border-2 border-girly-purple text-girly-purple text-sm font-semibold hover:bg-girly-purple/10 transition disabled:opacity-50"
                >
                  {t("events.saveDraftAndExit")}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowCancelConfirm(false);
                  resetForm();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-hot-pink text-white text-sm font-semibold hover:opacity-90 transition"
              >
                {t("events.discard")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
