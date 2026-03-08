"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { Loader2, LogOut, User, CalendarDays, Users, Sparkles, CalendarDays as CalendarIcon, Clock, MessageCircle } from "lucide-react";
import type { ProfileData } from "./_components/types";
import { formatDate } from "./_components/types";
import PostsCard from "./_components/PostsCard";

export default function ProfilePage() {
  const { data: session, status } = useSession();
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

  if (!session || !profile) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-10">
        <h1 className="text-2xl font-bold text-dark-purple mb-2">
          {t("profile.pleaseLogIn")}
        </h1>
      </div>
    );
  }

  const events = profile.eventAttendances.map((a) => a.event);

  const quizResultUrl = profile.quizResult
    ? (() => {
        const score = (profile.quizResult.answers as { score?: { S?: number; T?: number; E?: number; M?: number } })?.score ?? {};
        const params = new URLSearchParams({
          career: profile.quizResult.career,
          S: String(score.S ?? 0),
          T: String(score.T ?? 0),
          E: String(score.E ?? 0),
          M: String(score.M ?? 0),
        });
        return `/quiz/result?${params.toString()}`;
      })()
    : null;

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col md:flex-row">

      {/* LEFT PANEL */}
      <div className="relative md:w-[340px] lg:w-[380px] shrink-0 md:min-h-[calc(100vh-56px)] md:sticky md:top-14
        bg-strong-purple overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background-pattern.png')] bg-cover bg-center opacity-8" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-hot-pink/15 blur-3xl" />
        <div className="absolute top-1/3 -right-10 w-36 h-36 rounded-full bg-cute-orange/10 blur-3xl" />

        <div className="relative z-10 p-5 flex flex-col gap-5 h-full">

          {/* Profile */}
          <div className="flex items-center gap-3.5 pt-2 pb-1">
            <div className="w-13 h-13 rounded-full bg-linear-to-br from-cute-orange via-hot-pink to-light-pink
              flex items-center justify-center ring-2 ring-white/20 shadow-lg shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold text-white font-heading leading-tight truncate">
                {profile.username}
              </h1>
              <p className="text-white/70 flex items-center gap-1.5 text-[11px] mt-0.5">
                <CalendarDays className="w-3 h-3" />
                {t("profile.since", { date: formatDate(profile.createdAt) })}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-white/20" />

          {/* My Groups */}
          <div>
            <h3 className="text-[11px] font-bold text-white/80 uppercase tracking-wider mb-2.5">
              {t("profile.myGroups")}
            </h3>
            {profile.groupMemberships.length > 0 ? (
              <ul className="space-y-1.5">
                {profile.groupMemberships.map((m) => (
                  <li key={m.group.id}>
                    <Link
                      href={`/community/groups/${m.group.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl
                        bg-white/15 hover:bg-white/25 transition-colors text-sm text-white font-medium hover:text-white"
                    >
                      <Users size={15} className="text-white/60 shrink-0" />
                      <span className="truncate">{m.group.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/50 text-xs px-1">{t("profile.noGroupsYet")}</p>
            )}
          </div>

          {/* My Events */}
          <div>
            <h3 className="text-[11px] font-bold text-white/80 uppercase tracking-wider mb-2.5">
              {t("profile.myEvents")}
            </h3>
            {events.length > 0 ? (
              <div className="space-y-1.5">
                {events.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    className={`px-3 py-2.5 rounded-xl bg-white/15 ${ev.cancelled ? "opacity-50" : ""}`}
                  >
                    <p className="text-sm text-white font-medium truncate">
                      {ev.title}
                      {ev.cancelled && (
                        <span className="ml-1 text-[9px] bg-red-400/30 text-red-200 px-1.5 py-0.5 rounded-full">
                          {t("events.cancelled")}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-white/60">
                      <span className="flex items-center gap-1">
                        <CalendarIcon size={10} />
                        {formatDate(ev.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {ev.hour}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-xs px-1">{t("profile.noEventsYet")}</p>
            )}
          </div>

          {/* Career Quiz */}
          <div>
            <h3 className="text-[11px] font-bold text-white/80 uppercase tracking-wider mb-2.5">
              {t("profile.careerQuiz")}
            </h3>
            {profile.quizResult ? (
              <div className="px-3 py-3 rounded-xl bg-white/15">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-cute-orange shrink-0" />
                  <span className="text-sm font-semibold text-white truncate">
                    {profile.quizResult.career}
                  </span>
                </div>
                <p className="text-[10px] text-white/60 mt-1.5">
                  {t("profile.taken", { date: formatDate(profile.quizResult.createdAt) })}
                </p>
                <Link
                  href={quizResultUrl ?? "/quiz/result"}
                  className="text-xs text-white font-semibold mt-2 inline-block hover:underline transition-colors"
                >
                  {t("profile.viewResults")}
                </Link>
              </div>
            ) : (
              <Link
                href="/preQuiz"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                  bg-white/15 hover:bg-white/25 transition-colors text-sm text-white font-medium hover:text-white"
              >
                <Sparkles size={15} className="text-cute-orange shrink-0" />
                {t("profile.takeTheQuiz")}
              </Link>
            )}
          </div>

          {/* Spacer + Logout */}
          <div className="mt-auto pt-4">
            <div className="w-full h-px bg-white/20 mb-4" />
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition px-1"
            >
              <LogOut size={15} />
              {t("profile.logOut")}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT — Posts feed */}
      <div className="flex-1 min-w-0 bg-cream">
        <div className="px-6 sm:px-10 lg:px-14 pt-8 pb-12 animate-funfact-in">

          {/* Welcome banner */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-strong-purple to-girly-purple p-5 sm:p-6 mb-6">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-hot-pink/20 blur-2xl" />
            <div className="absolute -bottom-6 right-12 w-24 h-24 rounded-full bg-cute-orange/15 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-white text-lg sm:text-xl font-extrabold font-heading">
                {t("profile.hey", { username: profile.username })}
              </h2>
              <p className="text-white/60 text-sm mt-1">
                {t("profile.latestActivity")}
              </p>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full
                  bg-white/15 border border-white/20 text-white text-sm font-semibold
                  hover:bg-white/25 transition-all duration-300 backdrop-blur-sm"
              >
                <MessageCircle size={14} />
                {t("profile.goToCommunity")}
              </Link>
            </div>
          </div>

          <PostsCard posts={profile.posts} />

        </div>
      </div>

    </div>
  );
}
