"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { AuthModal } from "@/components/auth-modal";
import { Plus } from "lucide-react";
import { PostData, GroupData, EventData, STEM_CATEGORIES } from "./_components/helpers";
import { PostCard } from "./_components/post-card";
import { CreatePostForm } from "./_components/create-post-form";
import { CreateGroupModal } from "./_components/create-group-modal";
import { CreateEventModal } from "./_components/create-event-modal";
import { LeftSidebar } from "./_components/left-sidebar";
import { RightSidebar } from "./_components/right-sidebar";
import { GroupsList } from "./_components/groups-list";
import { EventsList } from "./_components/events-list";

type View = "feed" | "groups" | "liked" | "events";
const filterOptions = ["All", ...STEM_CATEGORIES];

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [attendingIds, setAttendingIds] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<View>("feed");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [likedPosts, setLikedPosts] = useState<PostData[]>([]);
  const [loadingLiked, setLoadingLiked] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/forum/posts");
      const data = await res.json();
      if (data.data) setPosts(data.data);
    } catch {
      // ignore
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const fetchLikedPosts = useCallback(async () => {
    setLoadingLiked(true);
    try {
      const res = await fetch("/api/forum/posts/liked");
      const data = await res.json();
      if (data.data) setLikedPosts(data.data);
    } catch {
      // ignore
    } finally {
      setLoadingLiked(false);
    }
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch("/api/groups");
      const data = await res.json();
      if (data.data) setGroups(data.data);
    } catch {
      // ignore
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.data) setEvents(data.data);
    } catch {
      // ignore
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  // Fetch which events current user is attending
  const fetchAttendingIds = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.data) {
        // We need to check attendance per event — use event detail endpoint
        // For efficiency, we'll derive from the events list + a dedicated check
        // For now, fetch all event details in parallel
        const ids = new Set<string>();
        const checks = (data.data as EventData[]).map(async (event) => {
          const detail = await fetch(`/api/events/${event.id}`);
          const d = await detail.json();
          if (d.data?.attendees?.some((a: { user: { id: string } }) => a.user.id === session.user.id)) {
            ids.add(event.id);
          }
        });
        await Promise.all(checks);
        setAttendingIds(ids);
      }
    } catch {
      // ignore
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowAuthModal(true);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts();
      fetchGroups();
      fetchEvents();
    }
  }, [status, fetchPosts, fetchGroups, fetchEvents]);

  useEffect(() => {
    if (activeView === "liked" && status === "authenticated") {
      fetchLikedPosts();
    }
  }, [activeView, status, fetchLikedPosts]);

  useEffect(() => {
    if (activeView === "events" && status === "authenticated") {
      fetchAttendingIds();
    }
  }, [activeView, status, fetchAttendingIds]);

  const handleLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              _count: {
                ...p._count,
                likes: p.likedByMe
                  ? p._count.likes - 1
                  : p._count.likes + 1,
              },
            }
          : p
      )
    );
    try {
      await fetch(`/api/forum/posts/${postId}/like`, { method: "POST" });
    } catch {
      fetchPosts();
    }
  };

  const handleLikedPostLike = async (postId: string) => {
    setLikedPosts((prev) => prev.filter((p) => p.id !== postId));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: false, _count: { ...p._count, likes: p._count.likes - 1 } }
          : p
      )
    );
    try {
      await fetch(`/api/forum/posts/${postId}/like`, { method: "POST" });
    } catch {
      fetchLikedPosts();
    }
  };

  const handleCreatePost = async (data: {
    title: string;
    content: string;
    categories: string[];
    tags: string[];
  }) => {
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setShowCreatePost(false);
        fetchPosts();
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const handleAttendEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/attend`, { method: "POST" });
      const data = await res.json();
      if (data.data) {
        setAttendingIds((prev) => {
          const next = new Set(prev);
          if (data.data.attending) {
            next.add(eventId);
          } else {
            next.delete(eventId);
          }
          return next;
        });
        // Update event attendee count
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  _count: {
                    ...e._count,
                    attendees: data.data.attending
                      ? e._count.attendees + 1
                      : e._count.attendees - 1,
                  },
                }
              : e
          )
        );
      }
    } catch {
      // ignore
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (data.data) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId ? { ...e, cancelled: data.data.cancelled } : e
          )
        );
      }
    } catch {
      // ignore
    }
  };

  const handleShareEventToForum = (event: EventData) => {
    setActiveView("feed");
    setShowCreatePost(true);
    // We'll pre-fill via a small delay so the form mounts first
    setTimeout(() => {
      const titleInput = document.querySelector<HTMLInputElement>(
        'input[placeholder="Post title"]'
      );
      const contentInput = document.querySelector<HTMLTextAreaElement>(
        'textarea[placeholder="What\'s on your mind?"]'
      );
      if (titleInput) titleInput.value = `Event: ${event.title}`;
      if (contentInput)
        contentInput.value = `Join us for "${event.title}"!\n\n${event.description}\n\nDate: ${new Date(event.date).toLocaleDateString()} at ${event.hour}\nModality: ${event.modality}${event.location ? `\nLocation: ${event.location}` : ""}${event.meetingLink ? `\nLink: ${event.meetingLink}` : ""}\nOrganized by: ${event.organizerName}`;
      // Trigger React onChange
      if (titleInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(titleInput, `Event: ${event.title}`);
        titleInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (contentInput) {
        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        const content = `Join us for "${event.title}"!\n\n${event.description}\n\nDate: ${new Date(event.date).toLocaleDateString()} at ${event.hour}\nModality: ${event.modality}${event.location ? `\nLocation: ${event.location}` : ""}${event.meetingLink ? `\nLink: ${event.meetingLink}` : ""}\nOrganized by: ${event.organizerName}`;
        nativeTextareaValueSetter?.call(contentInput, content);
        contentInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 100);
  };

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? [])));
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date() && !e.cancelled);

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => (p.categories ?? []).includes(activeCategory));

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-girly-purple text-lg font-medium animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
        }}
      />

      {!session && !showAuthModal && (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-10 gap-4">
          <h1 className="text-4xl font-bold text-girly-purple">Community</h1>
          <p className="text-dark-purple text-center max-w-md">
            Connect with other women in tech. Share stories, ask questions, and
            inspire each other.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-2 rounded-lg bg-girly-purple text-white font-semibold hover:bg-strong-purple transition"
          >
            Log in to continue
          </button>
        </div>
      )}

      {session && (
        <div className="max-w-7xl mx-auto grid grid-cols-[220px_1fr_260px] gap-6 p-6">
          <LeftSidebar
            activeView={activeView}
            onViewChange={setActiveView}
            groups={groups}
            onCreateGroup={() => setShowCreateGroup(true)}
          />

          <main className="space-y-5">
            {activeView === "feed" && (
              <>
                <div className="rounded-2xl bg-white border border-light-pink p-6 shadow-sm flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-dark-purple font-[family-name:var(--font-fredoka)]">
                      Hi,{" "}
                      <span className="text-girly-purple">
                        {session.user.name}!
                      </span>
                    </h1>
                    <p className="text-dark-purple/70 mt-1 text-sm max-w-xs">
                      There are {posts.length} discussion
                      {posts.length !== 1 && "s"} in your circles of interest.
                      Ready to learn something new today?
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreatePost(!showCreatePost)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-girly-purple text-girly-purple font-semibold text-sm hover:bg-girly-purple hover:text-white transition shrink-0"
                  >
                    <Plus size={18} />
                    Create Post
                  </button>
                </div>

                {showCreatePost && (
                  <CreatePostForm
                    onSubmit={handleCreatePost}
                    onCancel={() => setShowCreatePost(false)}
                  />
                )}

                <div className="flex gap-2">
                  {filterOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        activeCategory === cat
                          ? "bg-girly-purple text-white"
                          : "bg-white border border-light-pink text-dark-purple hover:bg-light-pink/30"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {loadingPosts && (
                  <div className="rounded-2xl bg-white border border-light-pink p-8 shadow-sm text-center">
                    <p className="text-girly-purple text-sm font-medium animate-pulse">
                      Loading posts...
                    </p>
                  </div>
                )}

                {!loadingPosts && filteredPosts.length === 0 && (
                  <div className="rounded-2xl bg-white border border-light-pink p-8 shadow-sm text-center">
                    <p className="text-dark-purple/50 text-sm">
                      {activeCategory === "All"
                        ? "No posts yet. Be the first to share something!"
                        : `No posts in ${activeCategory} yet.`}
                    </p>
                  </div>
                )}

                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    commentsApiBase={`/api/forum/posts/${post.id}`}
                  />
                ))}
              </>
            )}

            {activeView === "liked" && (
              <>
                <h2 className="text-xl font-bold text-dark-purple font-[family-name:var(--font-fredoka)]">
                  Liked Posts
                </h2>

                {loadingLiked && (
                  <div className="rounded-2xl bg-white border border-light-pink p-8 shadow-sm text-center">
                    <p className="text-girly-purple text-sm font-medium animate-pulse">
                      Loading liked posts...
                    </p>
                  </div>
                )}

                {!loadingLiked && likedPosts.length === 0 && (
                  <div className="rounded-2xl bg-white border border-light-pink p-8 shadow-sm text-center">
                    <p className="text-dark-purple/50 text-sm">
                      You haven&apos;t liked any posts yet.
                    </p>
                  </div>
                )}

                {likedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLikedPostLike}
                    commentsApiBase={`/api/forum/posts/${post.id}`}
                  />
                ))}
              </>
            )}

            {activeView === "events" && (
              <EventsList
                events={events}
                loading={loadingEvents}
                onCreateEvent={() => setShowCreateEvent(true)}
                onAttend={handleAttendEvent}
                onShareToForum={handleShareEventToForum}
                onEdit={(event) => {
                  setEditingEvent(event);
                  setShowCreateEvent(true);
                }}
                onCancel={handleCancelEvent}
                attendingIds={attendingIds}
                currentUserId={session.user.id}
              />
            )}

            {activeView === "groups" && (
              <GroupsList
                groups={groups}
                onCreateGroup={() => setShowCreateGroup(true)}
              />
            )}
          </main>

          <RightSidebar
            tags={allTags}
            upcomingEvents={upcomingEvents}
            onViewAllEvents={() => setActiveView("events")}
          />
        </div>
      )}

      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreated={() => {
          fetchGroups();
        }}
      />

      <CreateEventModal
        open={showCreateEvent}
        onClose={() => {
          setShowCreateEvent(false);
          setEditingEvent(null);
        }}
        onSaved={() => {
          fetchEvents();
        }}
        currentUsername={session?.user?.name ?? ""}
        editEvent={editingEvent}
      />
    </div>
  );
}
