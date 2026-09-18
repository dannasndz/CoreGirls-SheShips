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
  const [institution, setInstitution] = useState("UABC");
  const [campus, setCampus] = useState("");

  // Type-specific
  const [carrera, setCarrera] = useState("");
  const [semestre, setSemestre] = useState("");
  const [sector, setSector] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [fechaEgreso, setFechaEgreso] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError("");

    const payload: Record<string, unknown> = {
      userType,
      fullName,
      birthDate,
      email,
      username,
      password,
      institution,
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
          placeholder="Tu nombre completo"
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
          placeholder="tu@correo.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1">Nombre de usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputBase}
          placeholder="Handle público"
          required
        />
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
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className={inputBase}
          required
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
              placeholder="Tu carrera"
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
            placeholder="Área o sector de trabajo"
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
              placeholder="Tu carrera"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">Ocupación</label>
            <input
              type="text"
              value={ocupacion}
              onChange={(e) => setOcupacion(e.target.value)}
              className={inputBase}
              placeholder="Tu ocupación actual"
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
