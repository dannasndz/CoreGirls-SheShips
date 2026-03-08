"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { AuthModal } from "@/components/auth-modal";
import { Plus } from "lucide-react";
import { PostData, GroupData, STEM_CATEGORIES } from "./_components/helpers";
import { PostCard } from "./_components/post-card";
import { CreatePostForm } from "./_components/create-post-form";
import { CreateGroupModal } from "./_components/create-group-modal";
import { LeftSidebar } from "./_components/left-sidebar";
import { RightSidebar } from "./_components/right-sidebar";
import { GroupsList } from "./_components/groups-list";

type View = "feed" | "groups" | "liked";
const filterOptions = ["All", ...STEM_CATEGORIES];

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [activeView, setActiveView] = useState<View>("feed");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
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

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowAuthModal(true);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts();
      fetchGroups();
    }
  }, [status, fetchPosts, fetchGroups]);

  // Fetch liked posts when switching to that view
  useEffect(() => {
    if (activeView === "liked" && status === "authenticated") {
      fetchLikedPosts();
    }
  }, [activeView, status, fetchLikedPosts]);

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
    // Optimistic: remove from liked list (unlike)
    setLikedPosts((prev) => prev.filter((p) => p.id !== postId));
    // Also update main feed if the post is there
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

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? [])));

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
                {/* Greeting + Create Post */}
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

                {/* Category Filters */}
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

                {/* Posts */}
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

            {activeView === "groups" && (
              <GroupsList
                groups={groups}
                onCreateGroup={() => setShowCreateGroup(true)}
              />
            )}
          </main>

          <RightSidebar tags={allTags} />
        </div>
      )}

      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreated={() => {
          fetchGroups();
        }}
      />
    </div>
  );
}
