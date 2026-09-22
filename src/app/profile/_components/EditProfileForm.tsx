"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { uploadFile } from "@/lib/blob-upload";
import TagInput from "./TagInput";
import type { ProfileData } from "./types";

const CAMPUSES = [
  "ENSENADA",
  "MEXICALI",
  "TECATE",
  "TIJUANA",
  "PLAYAS_DE_ROSARITO",
  "SAN_QUINTIN",
  "SAN_FELIPE",
] as const;

const AREAS = ["CIENCIA", "TECNOLOGIA", "INGENIERIA", "MATEMATICAS"] as const;

function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

const inputBase =
  "w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-sm text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple";

export default function EditProfileForm({
  profile,
  onSaved,
}: {
  profile: ProfileData;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [description, setDescription] = useState(profile.description ?? "");
  const [interests, setInterests] = useState<string[]>(profile.interests ?? []);
  const [campus, setCampus] = useState(profile.campus ?? "");

  const [carrera, setCarrera] = useState(profile.carrera ?? "");
  const [semestre, setSemestre] = useState(
    profile.semestre != null ? String(profile.semestre) : ""
  );
  const [clubs, setClubs] = useState<string[]>(profile.clubs ?? []);
  const [fechaIngresoAlumna, setFechaIngresoAlumna] = useState(
    toDateInput(profile.fechaIngresoAlumna)
  );

  const [sector, setSector] = useState(profile.sector ?? "");
  const [areaSTEM, setAreaSTEM] = useState(profile.areaSTEM ?? "");
  const [materias, setMaterias] = useState<string[]>(profile.materias ?? []);
  const [fechaInicioLabor, setFechaInicioLabor] = useState(
    toDateInput(profile.fechaInicioLabor)
  );

  const [ocupacion, setOcupacion] = useState(profile.ocupacion ?? "");
  const [ubicacion, setUbicacion] = useState(profile.ubicacion ?? "");
  const [fechaIngreso, setFechaIngreso] = useState(
    toDateInput(profile.fechaIngreso)
  );
  const [fechaEgreso, setFechaEgreso] = useState(
    toDateInput(profile.fechaEgreso)
  );

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploadingAvatar(true);
    try {
      const url = await uploadFile(file, {
        userId: profile.id,
        category: "images",
      });
      setAvatarUrl(url);
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: url }),
      });
    } catch {
      setError(t("profile.uploadError"));
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const payload: Record<string, unknown> = {
      fullName,
      avatarUrl,
      description,
      interests,
      campus: campus || undefined,
    };

    if (profile.userType === "ALUMNA") {
      payload.carrera = carrera;
      payload.semestre = semestre === "" ? null : Number(semestre);
      payload.clubs = clubs;
      payload.fechaIngresoAlumna = fechaIngresoAlumna || null;
    } else if (profile.userType === "ACADEMICA") {
      payload.sector = sector;
      payload.areaSTEM = areaSTEM || undefined;
      payload.materias = materias;
      payload.fechaInicioLabor = fechaInicioLabor || null;
    } else if (profile.userType === "EGRESADA") {
      payload.carrera = carrera;
      payload.ocupacion = ocupacion;
      payload.ubicacion = ubicacion;
      payload.fechaIngreso = fechaIngreso || null;
      payload.fechaEgreso = fechaEgreso || null;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("profile.updateError"));
        setSaving(false);
        return;
      }
      setSuccess(true);
      onSaved();
    } catch {
      setError(t("profile.updateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white border border-light-pink shadow-sm p-5 space-y-4"
    >
      <h2 className="text-base font-extrabold text-dark-purple font-heading">
        {t("profile.profileData")}
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-strong-purple via-hot-pink to-cute-orange flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="avatar"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <User className="w-7 h-7 text-white" />
          )}
        </div>
        <div>
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-girly-purple text-girly-purple text-xs font-semibold cursor-pointer hover:bg-girly-purple/10 transition">
            {uploadingAvatar ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {t("profile.uploading")}
              </>
            ) : (
              t("profile.uploadPhoto")
            )}
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
            />
          </label>
          <p className="text-[11px] text-dark-purple/40 mt-1">
            {t("profile.optional")}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">
          {t("profile.fullName")}
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputBase}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">
          {t("profile.campus")}
        </label>
        <select
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          className={inputBase}
        >
          <option value="">{t("profile.selectPlaceholder")}</option>
          {CAMPUSES.map((c) => (
            <option key={c} value={c}>
              {t(`profile.campusNames.${c}`)}
            </option>
          ))}
        </select>
      </div>

      {profile.userType === "ALUMNA" && (
        <>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.career")}
            </label>
            <input
              type="text"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.semester")}
            </label>
            <input
              type="number"
              min={1}
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.entryDateLabel")}
            </label>
            <input
              type="date"
              value={fechaIngresoAlumna}
              onChange={(e) => setFechaIngresoAlumna(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.clubs")}
            </label>
            <TagInput
              values={clubs}
              onChange={setClubs}
              placeholder={t("profile.clubsPlaceholder")}
            />
          </div>
        </>
      )}

      {profile.userType === "ACADEMICA" && (
        <>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.sector")}
            </label>
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.areaStem")}
            </label>
            <select
              value={areaSTEM}
              onChange={(e) => setAreaSTEM(e.target.value)}
              className={inputBase}
            >
              <option value="">{t("profile.selectPlaceholder")}</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {t(`profile.areas.${a}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.laborStart")}
            </label>
            <input
              type="date"
              value={fechaInicioLabor}
              onChange={(e) => setFechaInicioLabor(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.subjects")}
            </label>
            <TagInput
              values={materias}
              onChange={setMaterias}
              placeholder={t("profile.subjectsPlaceholder")}
            />
          </div>
        </>
      )}

      {profile.userType === "EGRESADA" && (
        <>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.career")}
            </label>
            <input
              type="text"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.occupation")}
            </label>
            <input
              type="text"
              value={ocupacion}
              onChange={(e) => setOcupacion(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.location")}
            </label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.entryDateLabel")}
            </label>
            <input
              type="date"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("profile.graduationDate")}
            </label>
            <input
              type="date"
              value={fechaEgreso}
              onChange={(e) => setFechaEgreso(e.target.value)}
              className={inputBase}
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">
          {t("profile.aboutMe")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputBase}
          placeholder={t("profile.descriptionPlaceholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">
          {t("profile.interests")}
        </label>
        <TagInput
          values={interests}
          onChange={setInterests}
          placeholder={t("profile.interestsPlaceholder")}
        />
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      {success && (
        <p className="text-sm text-green-600 font-medium">{t("profile.updated")}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full h-10 bg-girly-purple text-white font-semibold hover:bg-strong-purple transition rounded-lg disabled:opacity-50"
      >
        {saving ? t("profile.saving") : t("profile.save")}
      </button>
    </form>
  );
}
