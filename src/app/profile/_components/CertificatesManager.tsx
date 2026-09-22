"use client";

import { useState } from "react";
import { Award, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { uploadFile } from "@/lib/blob-upload";
import { formatDate } from "./types";
import type { CertificateItem } from "./types";

const inputBase =
  "w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-sm text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple";

export default function CertificatesManager({
  initial,
  userId,
}: {
  initial: CertificateItem[];
  userId: string;
}) {
  const { t } = useI18n();
  const [items, setItems] = useState<CertificateItem[]>(initial);
  const [nombre, setNombre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !nombre.trim()) return;
    setBusy(true);
    setError("");
    try {
      const fileUrl = await uploadFile(file, {
        userId,
        category: "documents",
      });
      const res = await fetch("/api/profile/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, fileUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("profile.uploadError"));
        return;
      }
      setItems((prev) => [data.data, ...prev]);
      setNombre("");
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("profile.uploadError"));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("profile.confirmDelete"))) return;
    try {
      const res = await fetch(`/api/profile/certificates/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-light-pink shadow-sm p-5">
      <h2 className="text-base font-extrabold text-dark-purple font-heading mb-3">
        {t("profile.certificates")}
      </h2>

      {items.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {items.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-cream/60 px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Award size={16} className="text-cute-orange shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark-purple truncate">
                    {c.nombre}
                  </p>
                  <p className="text-[11px] text-dark-purple/40">
                    {formatDate(c.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={c.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-girly-purple hover:text-strong-purple"
                  aria-label={t("profile.viewFile")}
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="text-red-400 hover:text-red-600"
                  aria-label={t("profile.delete")}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-dark-purple/40 mb-4">
          {t("profile.noCertificates")}
        </p>
      )}

      <form onSubmit={handleUpload} className="space-y-3 border-t border-light-pink/60 pt-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={t("profile.certificateName")}
          className={inputBase}
          required
        />
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-xs text-dark-purple/60 file:mr-3 file:px-3 file:py-1.5 file:rounded-full file:border-0 file:bg-girly-purple/10 file:text-girly-purple file:text-xs file:font-semibold hover:file:bg-girly-purple/20"
          required
        />
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          {busy ? t("profile.uploading") : t("profile.uploadCertificate")}
        </button>
      </form>
    </div>
  );
}
