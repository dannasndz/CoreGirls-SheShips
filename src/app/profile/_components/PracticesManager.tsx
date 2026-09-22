"use client";

import { useState } from "react";
import { Briefcase, Pencil, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "./types";
import type { PracticeItem } from "./types";

const inputBase =
  "w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-sm text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple";

const emptyForm = {
  empresa: "",
  area: "",
  fechaInicio: "",
  fechaFin: "",
};

function toDateInput(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export default function PracticesManager({
  initial,
}: {
  initial: PracticeItem[];
}) {
  const { t } = useI18n();
  const [items, setItems] = useState<PracticeItem[]>(initial);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (p: PracticeItem) => {
    setEditingId(p.id);
    setForm({
      empresa: p.empresa,
      area: p.area,
      fechaInicio: toDateInput(p.fechaInicio),
      fechaFin: toDateInput(p.fechaFin),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch(
        editingId ? `/api/profile/practices/${editingId}` : "/api/profile/practices",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            empresa: form.empresa,
            area: form.area,
            fechaInicio: form.fechaInicio,
            fechaFin: form.fechaFin || null,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("profile.updateError"));
        return;
      }
      if (editingId) {
        setItems((prev) => prev.map((p) => (p.id === editingId ? data.data : p)));
      } else {
        setItems((prev) => [data.data, ...prev]);
      }
      resetForm();
    } catch {
      setError(t("profile.updateError"));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("profile.confirmDelete"))) return;
    try {
      const res = await fetch(`/api/profile/practices/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((p) => p.id !== id));
        if (editingId === id) resetForm();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-light-pink shadow-sm p-5">
      <h2 className="text-base font-extrabold text-dark-purple font-heading mb-3">
        {t("profile.practices")}
      </h2>

      {items.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-3 rounded-xl bg-cream/60 px-3 py-2.5"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <Briefcase size={16} className="text-strong-purple shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark-purple truncate">
                    {p.empresa}
                  </p>
                  <p className="text-xs text-dark-purple/50">{p.area}</p>
                  <p className="text-[11px] text-dark-purple/40 mt-0.5">
                    {formatDate(p.fechaInicio)}
                    {" – "}
                    {p.fechaFin ? formatDate(p.fechaFin) : t("profile.inProgress")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(p)}
                  className="text-girly-purple hover:text-strong-purple"
                  aria-label={t("profile.editPractice")}
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
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
          {t("profile.noPractices")}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-3 border-t border-light-pink/60 pt-4"
      >
        <p className="text-xs font-semibold text-dark-purple/60">
          {editingId ? t("profile.editPractice") : t("profile.addPractice")}
        </p>
        <input
          type="text"
          value={form.empresa}
          onChange={(e) => setForm({ ...form, empresa: e.target.value })}
          placeholder={t("profile.company")}
          className={inputBase}
          required
        />
        <input
          type="text"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          placeholder={t("profile.area")}
          className={inputBase}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-dark-purple/50 mb-1">
              {t("profile.startDate")}
            </label>
            <input
              type="date"
              value={form.fechaInicio}
              onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
              className={inputBase}
              required
            />
          </div>
          <div>
            <label className="block text-[11px] text-dark-purple/50 mb-1">
              {t("profile.endDate")}
            </label>
            <input
              type="date"
              value={form.fechaFin}
              onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
              className={inputBase}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-1.5 rounded-full bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
          >
            {editingId ? t("profile.save") : t("profile.add")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-1.5 rounded-full border border-light-pink text-dark-purple/60 text-sm font-semibold hover:bg-cream transition"
            >
              {t("profile.cancel")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
