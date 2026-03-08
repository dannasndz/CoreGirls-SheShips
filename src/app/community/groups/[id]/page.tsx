"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, use } from "react";
import { AuthModal } from "@/components/auth-modal";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { PostData, getInitial, getAvatarColor } from "../../_components/helpers";
import { PostCard } from "../../_components/post-card";
import { CreatePostForm } from "../../_components/create-post-form";

interface GroupMember {
  id: string;
  role: string;
  user: { id: string; username: string };
}

interface GroupDetail {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  _count: { members: number; posts: number };
}

export default function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = use(params);
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [joining, setJoining] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchGroup = useCallback(async () => {
    const res = await fetch(`/api/groups/${groupId}`);
    const data = await res.json();
    if (data.data) {
      setGroup(data.data);
    }
  }, [groupId]);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/posts`);
      const data = await res.json();
      if (data.data) setPosts(data.data);
    } catch {
      // ignore
    } finally {
      setLoadingPosts(false);
    }
  }, [groupId]);

  // Derive isMember from group + session instead of setting it in fetchGroup
  useEffect(() => {
    if (group && session) {
      setIsMember(
        group.members.some((m) => m.user.id === session.user.id)
      );
    }
  }, [group, session]);

  useEffect(() => {
    if (status === "unauthenticated") setShowAuthModal(true);
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchGroup();
      fetchPosts();
    }
  }, [status, fetchGroup, fetchPosts]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await fetch(`/api/groups/${groupId}/join`, { method: "POST" });
      fetchGroup();
    } catch {
      // ignore
    } finally {
      setJoining(false);
    }
  };

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
      await fetch(`/api/groups/${groupId}/posts/${postId}/like`, {
        method: "POST",
      });
    } catch {
      fetchPosts();
    }
  };

  const handleCreatePost = async (data: {
    title: string;
    content: string;
    categories: string[];
    tags: string[];
  }) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/posts`, {
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

  if (status === "loading" || (!group && session)) {
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

      {session && group && (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="rounded-2xl bg-white border border-light-pink p-4 sm:p-6 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Link
                  href="/community"
                  className="text-dark-purple/50 hover:text-girly-purple transition shrink-0"
                >
                  <ArrowLeft size={20} />
                </Link>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-dark-purple font-[family-name:var(--font-fredoka)] truncate">
                    {group.name}
                  </h1>
                  {group.description && (
                    <p className="text-sm text-dark-purple/60 mt-1">
                      {group.description}
                    </p>
                  )}
                  <p className="text-xs text-dark-purple/40 mt-1">
                    {group._count.members} member
                    {group._count.members !== 1 && "s"} &middot;{" "}
                    {group._count.posts} post
                    {group._count.posts !== 1 && "s"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 self-start">
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    isMember
                      ? "border-2 border-light-pink text-dark-purple/60 hover:border-hot-pink hover:text-hot-pink"
                      : "bg-girly-purple text-white hover:bg-strong-purple"
                  }`}
                >
                  {joining
                    ? "..."
                    : isMember
                      ? "Leave Group"
                      : "Join Group"}
                </button>
                {isMember && (
                  <button
                    onClick={() => setShowCreatePost(!showCreatePost)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-girly-purple text-girly-purple font-semibold text-sm hover:bg-girly-purple hover:text-white transition"
                  >
                    <Plus size={16} />
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6">
            {/* Posts Feed */}
            <div className="space-y-5">
              {showCreatePost && isMember && (
                <CreatePostForm
                  onSubmit={handleCreatePost}
                  onCancel={() => setShowCreatePost(false)}
                  placeholder="Share with the group..."
                />
              )}

              {!isMember && (
                <div className="rounded-2xl bg-white border border-light-pink p-6 shadow-sm text-center">
                  <p className="text-dark-purple/50 text-sm">
                    Join this group to see posts and participate in discussions.
                  </p>
                </div>
              )}

              {isMember && loadingPosts && (
                <div className="rounded-2xl bg-white border border-light-pink p-8 shadow-sm text-center">
                  <p className="text-girly-purple text-sm font-medium animate-pulse">
                    Loading posts...
                  </p>
                </div>
              )}

              {isMember && !loadingPosts && posts.length === 0 && (
                <div className="rounded-2xl bg-white border border-light-pink p-8 shadow-sm text-center">
                  <p className="text-dark-purple/50 text-sm">
                    No posts in this group yet. Be the first!
                  </p>
                </div>
              )}

              {isMember &&
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    commentsApiBase={`/api/groups/${groupId}/posts/${post.id}`}
                  />
                ))}
            </div>

            {/* Members Sidebar */}
            <aside>
              <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
                <h3 className="text-sm font-bold text-girly-purple mb-3 font-[family-name:var(--font-fredoka)]">
                  Members ({group._count.members})
                </h3>
                <ul className="space-y-2">
                  {group.members.map((m) => (
                    <li key={m.id} className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(m.user.username)}`}
                      >
                        {getInitial(m.user.username)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark-purple truncate">
                          {m.user.username}
                        </p>
                      </div>
                      {m.role === "admin" && (
                        <span className="text-[10px] font-semibold text-girly-purple bg-girly-purple/10 px-1.5 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
