"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateGroupModal({
  open,
  onClose,
  onCreated,
}: CreateGroupModalProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setName("");
        setDescription("");
        onCreated();
        onClose();
      }
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-purple/50 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-xl border border-light-pink">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-girly-purple font-[family-name:var(--font-fredoka)]">
            {t("createGroup.title")}
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
              {t("createGroup.groupName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("createGroup.groupNamePlaceholder")}
              className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-purple mb-1">
              {t("createGroup.descriptionOptional")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("createGroup.descriptionPlaceholder")}
              rows={2}
              className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-dark-purple/60 hover:bg-light-pink/30 transition"
            >
              {t("createGroup.cancel")}
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
            >
              {creating ? t("createGroup.creating") : t("createGroup.createGroup")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
