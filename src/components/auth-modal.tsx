"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { RegisterForm } from "@/components/register-form";
import { useI18n } from "@/lib/i18n";

type Mode = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("auth.invalidCredentials"));
        setLoading(false);
        return;
      }

      setEmail("");
      setPassword("");
      onSuccess();
      router.push("/community");
    } catch {
      setError(t("auth.somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-purple/50 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-xl border border-light-pink max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-girly-purple font-[family-name:var(--font-fredoka)]">
            {mode === "login" ? t("auth.welcomeBack") : t("auth.joinSheShips")}
          </h2>
          <button
            onClick={onClose}
            className="text-dark-purple/50 hover:text-dark-purple text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple"
                placeholder="ejemplo@uabc.edu.mx"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-purple mb-1">
                {t("auth.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple"
                placeholder={t("auth.passwordPlaceholder")}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-girly-purple text-white font-semibold hover:bg-strong-purple transition rounded-lg disabled:opacity-50"
            >
              {loading ? t("auth.loading") : t("auth.logIn")}
            </button>
          </form>
        ) : (
          <RegisterForm
            onSuccess={({ email: regEmail, password: regPassword }) => {
              signIn("credentials", {
                email: regEmail,
                password: regPassword,
                redirect: false,
              }).then((result) => {
                if (!result?.error) {
                  onSuccess();
                  router.push("/community");
                }
              });
            }}
            onError={(msg) => setError(msg)}
          />
        )}

        {error && mode === "signup" && (
          <p className="text-sm text-red-500 font-medium mt-3">{error}</p>
        )}

        <p className="mt-4 text-center text-sm text-dark-purple/70">
          {mode === "login" ? t("auth.dontHaveAccount") : t("auth.alreadyHaveAccount")}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className="text-girly-purple font-semibold hover:underline"
          >
            {mode === "login" ? t("auth.signUp") : t("auth.logIn")}
          </button>
        </p>
      </div>
    </div>
  );
}
