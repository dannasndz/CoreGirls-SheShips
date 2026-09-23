"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FolderPlus,
  FolderPen,
  ChevronDown,
  Search,
  X,
  ImagePlus,
  UserPlus,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useI18n } from "@/lib/i18n";
import { uploadFile } from "@/lib/blob-upload";
import {
  PROJECT_ESTADOS,
  PROJECT_MODALIDADES,
  PROJECT_AREAS,
  IMAGENES_MAX,
} from "@/lib/projects-validation";
import { ProjectData, ProjectUser } from "./helpers";

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  currentUser: { id: string; username: string };
  editProject?: ProjectData | null;
}

type Modalidad = (typeof PROJECT_MODALIDADES)[number];
type Estado = (typeof PROJECT_ESTADOS)[number];
type Area = (typeof PROJECT_AREAS)[number];

function toDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const parts = value.slice(0, 10).split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function CreateProjectModal({
  open,
  onClose,
  onSaved,
  currentUser,
  editProject,
}: ProjectFormModalProps) {
  const { t, locale } = useI18n();
  const isEdit = !!editProject;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [perfilInteresadas, setPerfilInteresadas] = useState("");
  const [estado, setEstado] = useState<Estado>("abierto");
  const [lugar, setLugar] = useState("");
  const [modalidad, setModalidad] = useState<Modalidad>("presencial");
  const [cupoMaximo, setCupoMaximo] = useState("");
  const [areasSTEM, setAreasSTEM] = useState<Area[]>([]);
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(undefined);
  const [fechaFin, setFechaFin] = useState<Date | undefined>(undefined);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [encargadas, setEncargadas] = useState<ProjectUser[]>([]);

  const [options, setOptions] = useState<ProjectUser[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = useCallback(() => {
    setNombre("");
    setDescripcion("");
    setPerfilInteresadas("");
    setEstado("abierto");
    setLugar("");
    setModalidad("presencial");
    setCupoMaximo("");
    setAreasSTEM([]);
    setFechaInicio(undefined);
    setFechaFin(undefined);
    setImagenes([]);
    setEncargadas([]);
    setSearch("");
    setError("");
  }, []);

  useEffect(() => {
    if (!open) return;
    if (editProject) {
      setNombre(editProject.nombre);
      setDescripcion(editProject.descripcion);
      setPerfilInteresadas(editProject.perfilInteresadas ?? "");
      setEstado(editProject.estado as Estado);
      setLugar(editProject.lugar ?? "");
      setModalidad((editProject.modalidad as Modalidad) ?? "presencial");
      setCupoMaximo(editProject.cupoMaximo ? String(editProject.cupoMaximo) : "");
      setAreasSTEM((editProject.areasSTEM ?? []) as Area[]);
      setFechaInicio(toDate(editProject.fechaInicio));
      setFechaFin(toDate(editProject.fechaFin));
      setImagenes(editProject.imagenes ?? []);
      setEncargadas(editProject.encargadas ?? []);
    } else {
      resetForm();
      setEncargadas([
        { id: currentUser.id, username: currentUser.username },
      ]);
    }
  }, [open, editProject, currentUser, resetForm]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch("/api/users?types=ACADEMICA,EGRESADA&limit=50")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.data) setOptions(data.data as ProjectUser[]);
      })
      .catch(() => {
        // ignore
      });
    return () => {
      active = false;
    };
  }, [open]);

  if (!open) return null;

  const formatDate = (d: Date) =>
    d.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const toggleArea = (value: Area) => {
    setAreasSTEM((prev) =>
      prev.includes(value)
        ? prev.filter((area) => area !== value)
        : [...prev, value]
    );
  };

  const addEncargada = (user: ProjectUser) => {
    setEncargadas((prev) =>
      prev.some((e) => e.id === user.id) ? prev : [...prev, user]
    );
    setSearch("");
  };

  const removeEncargada = (id: string) => {
    setEncargadas((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const remaining = IMAGENES_MAX - imagenes.length;
      const list = Array.from(files).slice(0, Math.max(remaining, 0));
      const urls: string[] = [];
      for (const file of list) {
        const url = await uploadFile(file, {
          userId: currentUser.id,
          category: "images",
        });
        urls.push(url);
      }
      setImagenes((prev) => [...prev, ...urls].slice(0, IMAGENES_MAX));
    } catch {
      setError(t("projects.errorImage"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !descripcion.trim() || !perfilInteresadas.trim() || !lugar.trim()) {
      setError(t("projects.errorRequired"));
      return;
    }
    if (cupoMaximo && (!Number.isInteger(Number(cupoMaximo)) || Number(cupoMaximo) <= 0)) {
      setError(t("projects.errorCupo"));
      return;
    }
    if (fechaInicio && fechaFin && fechaFin.getTime() < fechaInicio.getTime()) {
      setError(t("projects.errorDates"));
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre,
        descripcion,
        perfilInteresadas,
        estado,
        lugar,
        modalidad,
        cupoMaximo: cupoMaximo ? Number(cupoMaximo) : null,
        areasSTEM,
        fechaInicio: fechaInicio ? fechaInicio.toISOString().slice(0, 10) : null,
        fechaFin: fechaFin ? fechaFin.toISOString().slice(0, 10) : null,
        imagenes,
        encargadaIds: encargadas.map((e) => e.id),
      };

      const url = isEdit ? `/api/projects/${editProject.id}` : "/api/projects";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        onSaved();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || t("projects.errorFailed"));
      }
    } catch {
      setError(t("projects.errorGeneric"));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-[#E5E0D9] bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm";

  const filteredOptions = options.filter((u) => {
    if (encargadas.some((e) => e.id === u.id)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.fullName ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-purple/50 backdrop-blur-sm p-6"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-5 sm:p-6 md:p-8 shadow-xl border border-[#E5E0D9] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-girly-purple font-[family-name:var(--font-fredoka)] inline-flex items-center gap-2">
            {isEdit ? (
              <FolderPen size={22} className="text-girly-purple" />
            ) : (
              <FolderPlus size={22} className="text-girly-purple" />
            )}
            {isEdit ? t("projects.editProject") : t("projects.createProject")}
          </h2>
          <button
            onClick={handleClose}
            className="text-dark-purple/50 hover:text-dark-purple text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("projects.nameLabel")}
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={t("projects.namePlaceholder")}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("projects.descriptionLabel")}
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder={t("projects.descriptionPlaceholder")}
              rows={3}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("projects.profileLabel")}
            </label>
            <input
              type="text"
              value={perfilInteresadas}
              onChange={(e) => setPerfilInteresadas(e.target.value)}
              placeholder={t("projects.profilePlaceholder")}
              className={inputClass}
              required
            />
          </div>

          {/* Encargadas */}
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("projects.encargadasLabel")}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {encargadas.map((u) => (
                <span
                  key={u.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-girly-purple/10 text-strong-purple px-2.5 py-1 text-xs font-medium"
                >
                  {u.username}
                  {u.id !== currentUser.id && (
                    <button
                      type="button"
                      onClick={() => removeEncargada(u.id)}
                      className="text-strong-purple/70 hover:text-hot-pink"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`${inputClass} text-left flex items-center gap-2 text-dark-purple/50`}
                >
                  <UserPlus size={14} />
                  {t("projects.addEncargada")}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3 z-[200]" align="start">
                <div className="relative mb-2">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dark-purple/40"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("projects.searchUsersPlaceholder")}
                    className={`${inputClass} pl-8`}
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredOptions.length === 0 && (
                    <p className="text-xs text-dark-purple/40 px-2 py-1">
                      {t("projects.noUsersFound")}
                    </p>
                  )}
                  {filteredOptions.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => addEncargada(u)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-dark-purple hover:bg-girly-purple/10 transition"
                    >
                      {u.username}
                      <span className="block text-[11px] text-dark-purple/40">
                        {u.fullName}
                      </span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Estado + Modalidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-2">
                {t("projects.statusLabel")}
              </label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_ESTADOS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEstado(value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      estado === value
                        ? "bg-girly-purple text-white"
                        : "bg-girly-purple/10 text-strong-purple hover:bg-girly-purple/20"
                    }`}
                  >
                    {t(`projects.estados.${value}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-2">
                {t("projects.modalityLabel")}
              </label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_MODALIDADES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setModalidad(value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      modalidad === value
                        ? "bg-girly-purple text-white"
                        : "bg-girly-purple/10 text-strong-purple hover:bg-girly-purple/20"
                    }`}
                  >
                    {t(`projects.modalidades.${value}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lugar + Cupo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("projects.placeLabel")}
              </label>
              <input
                type="text"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                placeholder={t("projects.placePlaceholder")}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("projects.maxSpotsLabel")}
              </label>
              <input
                type="number"
                min="1"
                value={cupoMaximo}
                onChange={(e) => setCupoMaximo(e.target.value)}
                placeholder={t("projects.unlimited")}
                className={inputClass}
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("projects.startDateLabel")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`${inputClass} text-left flex items-center justify-between`}
                  >
                    <span className={fechaInicio ? "" : "text-dark-purple/40"}>
                      {fechaInicio
                        ? formatDate(fechaInicio)
                        : t("projects.optionalDate")}
                    </span>
                    <ChevronDown size={14} className="text-dark-purple/40" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[200]" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaInicio}
                    captionLayout="dropdown"
                    defaultMonth={fechaInicio}
                    onSelect={(date) => setFechaInicio(date)}
                  />
                  {fechaInicio && (
                    <button
                      type="button"
                      onClick={() => setFechaInicio(undefined)}
                      className="w-full text-xs text-dark-purple/50 hover:text-hot-pink py-1.5 border-t border-[#E5E0D9]"
                    >
                      {t("projects.clearDate")}
                    </button>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("projects.endDateLabel")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`${inputClass} text-left flex items-center justify-between`}
                  >
                    <span className={fechaFin ? "" : "text-dark-purple/40"}>
                      {fechaFin
                        ? formatDate(fechaFin)
                        : t("projects.optionalDate")}
                    </span>
                    <ChevronDown size={14} className="text-dark-purple/40" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[200]" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaFin}
                    captionLayout="dropdown"
                    defaultMonth={fechaFin ?? fechaInicio}
                    onSelect={(date) => setFechaFin(date)}
                  />
                  {fechaFin && (
                    <button
                      type="button"
                      onClick={() => setFechaFin(undefined)}
                      className="w-full text-xs text-dark-purple/50 hover:text-hot-pink py-1.5 border-t border-[#E5E0D9]"
                    >
                      {t("projects.clearDate")}
                    </button>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Áreas STEM */}
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-2">
              {t("projects.areaLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_AREAS.map((value) => {
                const active = areasSTEM.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleArea(value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      active
                        ? "bg-girly-purple text-white"
                        : "bg-girly-purple/10 text-strong-purple hover:bg-girly-purple/20"
                    }`}
                  >
                    {t(`profile.areas.${value}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-2">
              {t("projects.imagesLabel")}
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {imagenes.map((url) => (
                <span
                  key={url}
                  className="relative h-20 w-20 rounded-lg overflow-hidden bg-cream shrink-0"
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImagenes((prev) => prev.filter((u) => u !== url))
                    }
                    className="absolute top-1 right-1 rounded-full bg-dark-purple/60 text-white p-0.5 hover:bg-hot-pink"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {imagenes.length < IMAGENES_MAX && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-20 w-20 rounded-lg border-2 border-dashed border-[#E5E0D9] text-dark-purple/40 hover:border-girly-purple hover:text-girly-purple transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                >
                  <ImagePlus size={18} />
                  <span className="text-[10px]">
                    {uploading ? t("projects.uploading") : t("projects.addImage")}
                  </span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="flex gap-2 justify-end pt-2 border-t border-[#E5E0D9]/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm text-dark-purple/60 hover:bg-light-pink/30 transition"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-4 py-2 rounded-lg bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
            >
              {saving
                ? t("projects.saving")
                : isEdit
                  ? t("projects.saveChanges")
                  : t("projects.createProject")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
