"use client";

import { Award, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "./types";
import type { CertificateItem } from "./types";

export default function CertificatesList({
  certificados,
}: {
  certificados: CertificateItem[];
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl bg-white border border-light-pink shadow-sm p-5">
      <h2 className="text-base font-extrabold text-dark-purple font-heading mb-3">
        {t("profile.certificates")}
      </h2>

      {certificados.length > 0 ? (
        <ul className="space-y-2">
          {certificados.map((c) => (
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
              <a
                href={c.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-girly-purple hover:underline shrink-0"
              >
                {t("profile.viewFile")}
                <ExternalLink size={12} />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-dark-purple/40">{t("profile.noCertificates")}</p>
      )}
    </div>
  );
}
