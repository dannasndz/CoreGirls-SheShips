"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ProfileDetails from "../_components/ProfileDetails";
import CertificatesList from "../_components/CertificatesList";
import ProjectsList from "../_components/ProjectsList";
import type { CertificateItem, ProjectItem } from "../_components/types";

interface PublicProfileData {
  id: string;
  username: string;
  userType: string;
  fullName: string;
  avatarUrl: string | null;
  description: string | null;
  interests: string[];
  campus: string | null;
  carrera: string | null;
  sector: string | null;
  areaSTEM: string | null;
  materias: string[];
  ocupacion: string | null;
  ubicacion: string | null;
  createdAt: string;
  certificados: CertificateItem[];
  proyectos: ProjectItem[];
  quizResult: { career: string; createdAt: string } | null;
  _count: { posts: number };
}

export default function PublicProfilePage() {
  const { status } = useSession();
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated" && id) {
      fetch(`/api/users/${id}`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok || !data.data) {
            setNotFound(true);
          } else {
            setProfile(data.data);
          }
        })
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    }
  }, [status, id, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-girly-purple" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 p-10">
        <h1 className="text-2xl font-bold text-dark-purple">
          {t("profile.notFound")}
        </h1>
        <Link
          href="/community"
          className="text-sm font-semibold text-girly-purple hover:underline"
        >
          {t("profile.goToCommunity")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-5">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-girly-purple hover:underline"
        >
          <ArrowLeft size={16} />
          {t("profile.publicProfile")}
        </button>

        <ProfileDetails
          data={{
            fullName: profile.fullName,
            username: profile.username,
            userType: profile.userType,
            avatarUrl: profile.avatarUrl,
            institution: "UABC",
            campus: profile.campus,
            carrera: profile.carrera,
            sector: profile.sector,
            areaSTEM: profile.areaSTEM,
            materias: profile.materias,
            ocupacion: profile.ocupacion,
            ubicacion: profile.ubicacion,
            description: profile.description,
            interests: profile.interests,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CertificatesList certificados={profile.certificados} />
          <ProjectsList proyectos={profile.proyectos} />
        </div>
      </div>
    </div>
  );
}
