"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalSpotlight } from "@/components/MagicBento";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { Loader2, LogOut, User, CalendarDays, Users, Sparkles, CalendarDays as CalendarIcon, Clock, Compass, MessageCircle, Rocket } from "lucide-react";
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

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col md:flex-row">

      {/* LEFT PANEL */}
      <div className="relative md:w-[340px] lg:w-[380px] shrink-0 md:min-h-[calc(100vh-56px)] md:sticky md:top-14
        bg-strong-purple overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background-pattern.png')] bg-cover bg-center opacity-8" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-hot-pink/15 blur-3xl" />
        <div className="absolute top-1/3 -right-10 w-36 h-36 rounded-full bg-cute-orange/10 blur-3xl" />

        <div
          className="card-grid profile-bento bento-section"
          ref={gridRef}
        >
          <QuizCard quizResult={profile.quizResult} />
          <GroupsCard memberships={profile.groupMemberships} />
          <EventsCard
            title={t("profile.eventsCreated")}
            events={profile.events}
            emptyText={t("profile.noEventsYet")}
          />
          <PostsCard posts={profile.posts} />
          <EventsCard
            title={t("profile.attendingLabel")}
            events={profile.eventAttendances.map((a) => a.event)}
            emptyText={t("profile.notAttending")}
          />
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
                Hey, {profile.username}! 
              </h2>
              <p className="text-white/60 text-sm mt-1">
                Check out your latest activity and keep building your STEM journey.
              </p>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full
                  bg-white/15 border border-white/20 text-white text-sm font-semibold
                  hover:bg-white/25 transition-all duration-300 backdrop-blur-sm"
              >
                <MessageCircle size={14} />
                Go to Community
              </Link>
            </div>
          </div>

          <PostsCard posts={profile.posts} />

         
        </div>
      </div>

    </div>
  );
}
