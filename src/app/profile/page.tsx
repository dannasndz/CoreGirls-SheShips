"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalSpotlight } from "@/components/MagicBento";
import { Loader2 } from "lucide-react";
import type { ProfileData } from "./_components/types";
import { GLOW_COLOR } from "./_components/types";
import ProfileHeader from "./_components/ProfileHeader";
import QuizCard from "./_components/QuizCard";
import GroupsCard from "./_components/GroupsCard";
import EventsCard from "./_components/EventsCard";
import PostsCard from "./_components/PostsCard";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
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
          Please log in to view your profile
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <ProfileHeader
        username={profile.username}
        createdAt={profile.createdAt}
        counts={profile._count}
      />

      <div className="py-6 px-2">
        <GlobalSpotlight
          gridRef={gridRef}
          enabled
          spotlightRadius={350}
          glowColor={GLOW_COLOR}
        />

        <div
          className="card-grid profile-bento bento-section"
          ref={gridRef}
        >
          <QuizCard quizResult={profile.quizResult} />
          <GroupsCard memberships={profile.groupMemberships} />
          <EventsCard
            title="Events Created"
            events={profile.events}
            emptyText="No events yet"
          />
          <PostsCard posts={profile.posts} />
          <EventsCard
            title="Attending"
            events={profile.eventAttendances.map((a) => a.event)}
            emptyText="Not attending any events"
          />
        </div>
      </div>
    </div>
  );
}
