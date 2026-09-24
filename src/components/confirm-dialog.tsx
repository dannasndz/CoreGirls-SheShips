"use client";

import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  message,
  title,
  confirmLabel,
  cancelLabel,
  busy = false,
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4"
      onClick={busy ? undefined : onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-light-pink"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-lg font-bold text-dark-purple font-heading mb-2">
            {title}
          </h2>
        )}
        <p className="text-sm text-dark-purple/70 leading-relaxed">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-1.5 rounded-full border border-light-pink text-dark-purple/70 text-sm font-semibold hover:bg-cream transition disabled:opacity-50"
          >
            {cancelLabel ?? t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-sm font-semibold transition disabled:opacity-50 ${
              destructive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-girly-purple hover:bg-strong-purple"
            }`}
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel ?? t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
