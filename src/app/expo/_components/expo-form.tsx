"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  EXPO_AGE_MAX,
  EXPO_AGE_MIN,
  EXPO_GENDERS,
  EXPO_GRADOS,
  EXPO_MUNICIPIOS,
  EXPO_NIVELES,
  EXPO_STORAGE_KEY,
  validateExpoDemographics,
  type ExpoNivel,
} from "@/lib/expo-validation";

type StudentAnswer = "" | "si" | "no";

export function ExpoForm() {
  const { t } = useI18n();
  const router = useRouter();

  const [estudiante, setEstudiante] = useState<StudentAnswer>("");
  const [edad, setEdad] = useState("");
  const [escuela, setEscuela] = useState("");
  const [nivel, setNivel] = useState<ExpoNivel | "">("");
  const [grado, setGrado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [genero, setGenero] = useState("");
  const [error, setError] = useState("");

  const grados = useMemo(
    () => (nivel ? EXPO_GRADOS[nivel] : []),
    [nivel]
  );

  const inputClass =
    "w-full rounded-lg border border-[#E5E0D9] bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm";

  const handleStudentChange = (value: StudentAnswer) => {
    setEstudiante(value);
    if (value !== "si") {
      setEscuela("");
      setNivel("");
      setGrado("");
    }
  };

  const gradoLabel = (value: string) =>
    nivel === "Posgrado" ? t(`expo.posgrados.${value}`) : value;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = validateExpoDemographics({
      estudiante: estudiante === "" ? undefined : estudiante === "si",
      edad,
      escuela,
      nivel,
      grado,
      municipio,
      genero,
    });

    if (!result.ok) {
      setError(t("expo.errorInvalid"));
      return;
    }

    try {
      sessionStorage.setItem(EXPO_STORAGE_KEY, JSON.stringify(result.data));
    } catch {
      // Si sessionStorage falla, continuamos igual (el quiz pedirá los datos).
    }

    router.push("/quiz?expo=1");
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E5E0D9] shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="text-girly-purple" size={22} />
          <h1 className="text-2xl font-bold text-dark-purple font-[family-name:var(--font-fredoka)]">
            {t("expo.title")}
          </h1>
        </div>
        <p className="text-sm text-dark-purple/60 mb-5">{t("expo.subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("expo.student")}
            </label>
            <div className="flex gap-2">
              {(
                [
                  { value: "si", label: t("expo.yes") },
                  { value: "no", label: t("expo.no") },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStudentChange(option.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    estudiante === option.value
                      ? "bg-girly-purple text-white"
                      : "bg-girly-purple/10 text-strong-purple hover:bg-girly-purple/20"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("expo.age")}
              </label>
              <input
                type="number"
                min={EXPO_AGE_MIN}
                max={EXPO_AGE_MAX}
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder={t("expo.agePlaceholder")}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("expo.gender")}
              </label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className={inputClass}
              >
                <option value="">{t("expo.optional")}</option>
                {EXPO_GENDERS.map((value) => (
                  <option key={value} value={value}>
                    {t(`expo.genders.${value}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {estudiante === "si" && (
            <>
              <div>
                <label className="block text-sm font-medium text-dark-purple mb-1">
                  {t("expo.school")}
                </label>
                <input
                  type="text"
                  value={escuela}
                  onChange={(e) => setEscuela(e.target.value)}
                  placeholder={t("expo.schoolPlaceholder")}
                  className={inputClass}
                  maxLength={100}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-purple mb-1">
                    {t("expo.level")}
                  </label>
                  <select
                    value={nivel}
                    onChange={(e) => {
                      setNivel(e.target.value as ExpoNivel | "");
                      setGrado("");
                    }}
                    className={inputClass}
                    required
                  >
                    <option value="">{t("expo.select")}</option>
                    {EXPO_NIVELES.map((value) => (
                      <option key={value} value={value}>
                        {t(`expo.levels.${value}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-purple mb-1">
                    {t("expo.grade")}
                  </label>
                  <select
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    className={inputClass}
                    disabled={!nivel}
                    required
                  >
                    <option value="">{t("expo.select")}</option>
                    {grados.map((value) => (
                      <option key={value} value={value}>
                        {gradoLabel(value)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("expo.municipality")}
            </label>
            <select
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">{t("expo.select")}</option>
              {EXPO_MUNICIPIOS.map((value) => (
                <option key={value} value={value}>
                  {value === "Otro" ? t("expo.other") : value}
                </option>
              ))}
            </select>
          </div>

          <p className="text-[11px] leading-relaxed text-dark-purple/50 bg-cream/70 rounded-lg px-3 py-2">
            {t("expo.privacy")}
          </p>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-girly-purple text-white font-semibold py-2.5 hover:bg-strong-purple transition"
          >
            {t("expo.start")}
          </button>
        </form>
      </div>
    </div>
  );
}
