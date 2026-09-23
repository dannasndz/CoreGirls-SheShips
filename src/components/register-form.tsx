"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface RegisterFormProps {
  onSuccess: (credentials: { email: string; password: string }) => void;
  onError: (msg: string) => void;
}

const campuses = [
  "ENSENADA",
  "MEXICALI",
  "TECATE",
  "TIJUANA",
  "PLAYAS_DE_ROSARITO",
  "SAN_QUINTIN",
  "SAN_FELIPE",
] as const;

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const [userType, setUserType] = useState<"ALUMNA" | "ACADEMICA" | "EGRESADA">("ALUMNA");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState("");

  // Type-specific
  const [carrera, setCarrera] = useState("");
  const [semestre, setSemestre] = useState("");
  const [sector, setSector] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [fechaEgreso, setFechaEgreso] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");

    const cleanUsername = username.trim();
    if (!/^[a-zA-Z0-9._]{3,30}$/.test(cleanUsername)) {
      onError(
        "El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede incluir letras, números, punto (.) y guion bajo (_), sin espacios."
      );
      return;
    }

    if (userType === "ALUMNA" && semestre) {
      const sem = Number(semestre);
      if (!Number.isInteger(sem) || sem < 1 || sem > 9) {
        onError("El semestre debe estar entre 1 y 9.");
        return;
      }
    }

    setLoading(true);

    const payload: Record<string, unknown> = {
      userType,
      fullName,
      birthDate,
      email,
      username: cleanUsername,
      password,
    };

    if (campus) payload.campus = campus;

    if (userType === "ALUMNA") {
      if (carrera) payload.carrera = carrera;
      if (semestre) payload.semestre = Number(semestre);
    } else if (userType === "ACADEMICA") {
      if (sector) payload.sector = sector;
    } else if (userType === "EGRESADA") {
      if (carrera) payload.carrera = carrera;
      if (ocupacion) payload.ocupacion = ocupacion;
      if (fechaEgreso) payload.fechaEgreso = fechaEgreso;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || t("auth.registrationFailed") || "Error en el registro");
        setLoading(false);
        return;
      }
      onSuccess({ email, password });
    } catch {
      onError(t("auth.somethingWentWrong") || "Algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">Tipo de usuario</label>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value as typeof userType)}
          className={inputBase}
        >
          <option value="ALUMNA">Alumna</option>
          <option value="ACADEMICA">Académica</option>
          <option value="EGRESADA">Egresada</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">Nombre completo</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputBase}
          placeholder="Ej. Ana García López"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">Fecha de nacimiento</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={inputBase}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputBase}
          placeholder="ejemplo@uabc.edu.mx"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">Nombre de usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value.replace(/[^a-zA-Z0-9._]/g, "").slice(0, 30))
          }
          className={inputBase}
          placeholder="Ej. ana.garcia"
          pattern="[A-Za-z0-9._]+"
          minLength={3}
          maxLength={30}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          title="Solo letras, números, punto (.) y guion bajo (_), sin espacios"
          required
        />
        <p className="mt-1 text-[11px] text-dark-purple/40">
          Solo letras, números, punto (.) y guion bajo (_). Sin espacios.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputBase}
          placeholder="Mínimo 8 caracteres, una mayúscula y un número"
          required
          minLength={8}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">Institución</label>
        <input
          type="text"
          value="UABC"
          readOnly
          aria-readonly="true"
          tabIndex={-1}
          className={`${inputBase} cursor-not-allowed bg-cream/60 text-dark-purple/60`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">Campus</label>
        <select value={campus} onChange={(e) => setCampus(e.target.value)} className={inputBase} required>
          <option value="">Selecciona un campus</option>
          {campuses.map((c) => (
            <option key={c} value={c}>
              {c.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {userType === "ALUMNA" && (
        <>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">Carrera</label>
            <input
              type="text"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className={inputBase}
              placeholder="Ej. Ingeniería en Computación"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">Semestre</label>
            <input
              type="number"
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              className={inputBase}
              placeholder="Ej. 5"
              min={1}
              max={9}
            />
          </div>
        </>
      )}

      {userType === "ACADEMICA" && (
        <div>
          <label className="block text-sm font-medium text-dark-purple mb-1">Sector</label>
          <input
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className={inputBase}
            placeholder="Ej. Tecnología"
          />
        </div>
      )}

      {userType === "EGRESADA" && (
        <>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">Carrera</label>
            <input
              type="text"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className={inputBase}
              placeholder="Ej. Ingeniería en Computación"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">Ocupación</label>
            <input
              type="text"
              value={ocupacion}
              onChange={(e) => setOcupacion(e.target.value)}
              className={inputBase}
              placeholder="Ej. Ingeniera de software"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">Fecha de egreso</label>
            <input
              type="date"
              value={fechaEgreso}
              onChange={(e) => setFechaEgreso(e.target.value)}
              className={inputBase}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-girly-purple text-white font-semibold hover:bg-strong-purple transition rounded-lg disabled:opacity-50"
      >
        {loading ? (t("auth.loading") || "Cargando...") : (t("auth.signUp") || "Registrarse")}
      </button>
    </form>
  );
}
