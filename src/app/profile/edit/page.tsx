"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ProfileData } from "../_components/types";
import EditProfileForm from "../_components/EditProfileForm";
import CertificatesManager from "../_components/CertificatesManager";
import PracticesManager from "../_components/PracticesManager";

export default function EditProfilePage() {
  const { status } = useSession();
  const { t } = useI18n();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((res) => {
          if (res.data) setProfile(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-girly-purple" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-10">
        <h1 className="text-2xl font-bold text-dark-purple">
          {t("profile.pleaseLogIn")}
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-5">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-girly-purple hover:underline"
        >
          <ArrowLeft size={16} />
          {t("profile.backToProfile")}
        </Link>

        <h1 className="text-2xl font-extrabold text-dark-purple font-heading">
          {t("profile.editProfile")}
        </h1>

        <EditProfileForm
          profile={profile}
          onSaved={() => {
            router.refresh();
          }}
        />

        <CertificatesManager initial={profile.certificados} />

        {profile.userType === "ALUMNA" && (
          <PracticesManager initial={profile.practicas} />
        )}
      </div>
    </div>
  );
}
