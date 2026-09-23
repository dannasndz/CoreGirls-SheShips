"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { timeAgo, PostData } from "./helpers";
import { CommentsSection } from "./comments-section";
import { UserAvatar } from "./user-avatar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useI18n } from "@/lib/i18n";

const categoryLabelKeys: Record<string, string> = {
  Science: "exploreCareers.science",
  Technology: "exploreCareers.technology",
  Engineer: "exploreCareers.engineering",
  Mathematics: "exploreCareers.mathematics",
};

interface PostCardProps {
  post: PostData;
  onLike: (postId: string) => void;
  commentsApiBase: string;
  onDeleted?: (postId: string) => void;
  onUpdated?: (post: PostData) => void;
}

export function PostCard({
  post,
  onLike,
  commentsApiBase,
  onDeleted,
  onUpdated,
}: PostCardProps) {
  const { t, locale } = useI18n();
  const { data: session } = useSession();
  const isOwner = session?.user?.id === post.author.id;

  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const requestDelete = () => {
    setMenuOpen(false);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(commentsApiBase, { method: "DELETE" });
      if (!res.ok) {
        setError(t("post.deleteError"));
        setConfirmOpen(false);
        setDeleting(false);
        return;
      }
      onDeleted?.(post.id);
    } catch {
      setError(t("post.deleteError"));
      setConfirmOpen(false);
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError(t("post.required"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(commentsApiBase, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("post.saveError"));
        return;
      }
      onUpdated?.({
        ...post,
        title: data.data.title,
        content: data.data.content,
      });
      setEditing(false);
    } catch {
      setError(t("post.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setTitle(post.title);
    setContent(post.content);
    setEditing(false);
    setError("");
  };

  return (
    <article className="rounded-2xl bg-white border border-[#E5E0D9] p-3 sm:p-4 md:p-5 shadow-sm space-y-2 sm:space-y-3">
      {/* Author header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <UserAvatar user={post.author} size={40} />
          <div>
            <Link
              href={`/profile/${post.author.id}`}
              className="text-xs sm:text-sm font-semibold text-dark-purple hover:text-girly-purple hover:underline transition"
            >
              {post.author.username}
            </Link>
            <p className="text-xs text-dark-purple/50">
              {timeAgo(post.createdAt, locale)}
            </p>
          </div>
        </div>

        {isOwner && !editing && (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={t("post.options")}
              className="p-1.5 rounded-full text-dark-purple/40 hover:text-dark-purple hover:bg-light-pink/30 transition"
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  aria-hidden
                  tabIndex={-1}
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-light-pink bg-white shadow-lg py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                      setError("");
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-dark-purple hover:bg-cream transition"
                  >
                    <Pencil size={14} /> {t("post.edit")}
                  </button>
                  <button
                    type="button"
                    onClick={requestDelete}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 size={14} /> {t("post.delete")}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Categories + Tags */}
      {((post.categories ?? []).length > 0 ||
        (post.tags ?? []).length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {(post.categories ?? []).map((cat: string) => (
            <span
              key={cat}
              className="px-2.5 py-0.5 rounded-full bg-cute-orange/10 text-cute-orange text-xs font-semibold"
            >
              {categoryLabelKeys[cat] ? t(categoryLabelKeys[cat]) : cat}
            </span>
          ))}
          {(post.tags ?? []).map((tag: string) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-hot-pink/10 text-hot-pink text-xs font-medium cursor-pointer hover:bg-hot-pink/20 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {editing ? (
        /* Edit mode */
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-sm font-bold text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple"
            placeholder={t("post.titlePlaceholder")}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-sm text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple resize-y"
            placeholder={t("post.contentPlaceholder")}
          />
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {t("post.save")}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-1.5 rounded-full border border-light-pink text-dark-purple/60 text-sm font-semibold hover:bg-cream transition"
            >
              {t("post.cancel")}
            </button>
          </div>
        </div>
      ) : (
        /* View mode */
        <>
          <h2 className="text-sm sm:text-base md:text-xl font-bold text-dark-purple">
            {post.title}
          </h2>
          <p className="-mt-2 text-xs sm:text-sm md:text-lg text-dark-purple/70 leading-relaxed">
            {post.content}
          </p>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </>
      )}

      {/* Actions */}
      {!editing && (
        <div className="flex items-center gap-5 border-tborder-[#E5E0D9]/50">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 transition text-md ${
              post.likedByMe
                ? "text-hot-pink"
                : "text-dark-purple/50 hover:text-hot-pink"
            }`}
          >
            <Heart
              size={18}
              fill={post.likedByMe ? "currentColor" : "none"}
            />
            {post._count.likes}
          </button>
          <span className="flex items-center gap-1.5 text-dark-purple/50 text-md">
            <MessageCircle size={18} />
            {commentCount}
          </span>
        </div>
      )}

      {/* Comments */}
      {!editing && (
        <CommentsSection
          apiBase={commentsApiBase}
          onCommentAdded={() => setCommentCount((c) => c + 1)}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        message={t("post.confirmDelete")}
        busy={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </article>
  );
}
