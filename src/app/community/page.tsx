"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { AuthModal } from "@/components/auth-modal";
import {
  Home,
  Users,
  Calendar,
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  MoreHorizontal,
  Plus,
  LogOut,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string };
  _count: { likes: number };
}

const categories = ["All", "Science", "Technology", "Engineer"];

const trendingTopics = [
  "#WomenInSTEM",
  "#NASA",
  "#NASA",
  "#WomenInSTEM",
  "#WomenInSTEM",
  "#HiWomen",
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

const avatarColors = [
  "bg-cute-orange",
  "bg-girly-purple",
  "bg-hot-pink",
  "bg-strong-purple",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/forum/posts");
      const data = await res.json();
      if (data.data) setPosts(data.data);
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
    if (session) fetchPosts();
  }, [session, fetchPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setPosting(true);
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setShowCreatePost(false);
        fetchPosts();
      }
    } catch {
      // ignore
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/forum/posts/${postId}/like`, { method: "POST" });
      fetchPosts();
    } catch {
      // ignore
    }
  };

  // Auth gate: show full-page overlay if not logged in
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
          window.location.reload();
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
          {/* Left Sidebar */}
          <aside className="space-y-6">
            {/* Navigation */}
            <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
              <h3 className="text-sm font-bold text-girly-purple mb-3 font-[family-name:var(--font-fredoka)]">
                Navigation
              </h3>
              <nav className="space-y-1">
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-girly-purple/10 text-girly-purple font-medium text-sm"
                >
                  <Home size={18} />
                  Home
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-purple hover:bg-light-pink/30 text-sm transition"
                >
                  <Users size={18} />
                  Groups
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-purple hover:bg-light-pink/30 text-sm transition"
                >
                  <Calendar size={18} />
                  Events
                </a>
              </nav>
            </div>

            {/* My Groups */}
            <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
              <h3 className="text-sm font-bold text-girly-purple mb-3 font-[family-name:var(--font-fredoka)]">
                My groups
              </h3>
              <ul className="space-y-2 text-sm text-dark-purple">
                <li className="flex items-center gap-2">
                  <Users size={16} className="text-dark-purple/50" />
                  Web Devs Sisters
                </li>
                <li className="flex items-center gap-2">
                  <Users size={16} className="text-dark-purple/50" />
                  Bioinformatic Girls
                </li>
              </ul>
            </div>

            {/* Logout */}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm text-dark-purple/60 hover:text-hot-pink transition px-2"
            >
              <LogOut size={16} />
              Log out
            </button>
          </aside>

          {/* Center Feed */}
          <main className="space-y-5">
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
                  There are {posts.length} discussion{posts.length !== 1 && "s"}{" "}
                  in your circles of interest. Ready to learn something new
                  today?
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

            {/* Create Post Form */}
            {showCreatePost && (
              <form
                onSubmit={handleCreatePost}
                className="rounded-2xl bg-white border border-light-pink p-5 shadow-sm space-y-3"
              >
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm"
                  required
                />
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm resize-none"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="px-4 py-1.5 rounded-lg text-sm text-dark-purple/60 hover:bg-light-pink/30 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={posting}
                    className="px-4 py-1.5 rounded-lg bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
                  >
                    {posting ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            )}

            {/* Category Filters */}
            <div className="flex gap-2">
              {categories.map((cat) => (
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
            {posts.length === 0 && (
              <div className="rounded-2xl bg-white border border-light-pink p-8 shadow-sm text-center">
                <p className="text-dark-purple/50 text-sm">
                  No posts yet. Be the first to share something!
                </p>
              </div>
            )}

            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl bg-white border border-light-pink p-5 shadow-sm space-y-3"
              >
                {/* Author header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(post.author.username)}`}
                    >
                      {getInitial(post.author.username)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-purple">
                        {post.author.username}
                      </p>
                      <p className="text-xs text-dark-purple/50">
                        {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button className="text-dark-purple/30 hover:text-dark-purple transition">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-dark-purple">
                  {post.title}
                </h3>
                <p className="text-sm text-dark-purple/70 leading-relaxed">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-light-pink/50">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 text-dark-purple/50 hover:text-hot-pink transition text-sm"
                    >
                      <Heart size={18} />
                      {post._count.likes}
                    </button>
                    <span className="flex items-center gap-1.5 text-dark-purple/50 text-sm">
                      <MessageCircle size={18} />0
                    </span>
                    <span className="flex items-center gap-1.5 text-dark-purple/50 text-sm">
                      <Eye size={18} />0
                    </span>
                  </div>
                  <button className="text-dark-purple/30 hover:text-girly-purple transition">
                    <Bookmark size={18} />
                  </button>
                </div>
              </article>
            ))}
          </main>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Trending Topics */}
            <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
              <h3 className="text-sm font-bold text-girly-purple mb-3 font-[family-name:var(--font-fredoka)]">
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-sm text-dark-purple font-medium hover:text-girly-purple cursor-pointer transition"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-light-pink">
              <div className="bg-gradient-to-br from-girly-purple to-light-pink p-5 text-white">
                <h3 className="text-sm font-bold font-[family-name:var(--font-fredoka)] mb-12">
                  Upcoming Events
                </h3>
              </div>
              <div className="bg-white p-3 text-center">
                <a
                  href="#"
                  className="text-sm text-girly-purple font-medium hover:underline"
                >
                  See all events
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
