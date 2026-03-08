"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type Mode = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || t("auth.registrationFailed"));
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("auth.invalidCredentials"));
        setLoading(false);
        return;
      }

      setUsername("");
      setPassword("");
      onSuccess();
    } catch {
      setError(t("auth.somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-purple/50 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-xl border border-light-pink">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("auth.username")}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple"
              placeholder={t("auth.usernamePlaceholder")}
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
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-girly-purple text-white font-semibold hover:bg-strong-purple transition"
          >
            {loading
              ? t("auth.loading")
              : mode === "login"
                ? t("auth.logIn")
                : t("auth.signUp")}
          </Button>
        </form>

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
