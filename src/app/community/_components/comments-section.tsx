"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ChevronDown,
  ChevronUp,
  Send,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { timeAgo, CommentData } from "./helpers";
import { UserAvatar } from "./user-avatar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useI18n } from "@/lib/i18n";

interface CommentsSectionProps {
  apiBase: string;
  onCommentAdded?: () => void;
}

export function CommentsSection({ apiBase, onCommentAdded }: CommentsSectionProps) {
  const { t, locale } = useI18n();
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchComments = useCallback(async () => {
    const res = await fetch(`${apiBase}/comments`);
    const data = await res.json();
    if (data.data) setComments(data.data);
  }, [apiBase]);

  useEffect(() => {
    if (expanded) fetchComments();
  }, [expanded, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
        onCommentAdded?.();
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c: CommentData) => {
    setMenuOpenId(null);
    setEditingId(c.id);
    setEditContent(c.content);
    setActionError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setActionError("");
  };

  const saveEdit = async (id: string) => {
    if (!editContent.trim()) {
      setActionError(t("comments.required"));
      return;
    }
    setSavingId(id);
    setActionError("");
    try {
      const res = await fetch(`${apiBase}/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || t("comments.saveError"));
        return;
      }
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content: data.data.content } : c))
      );
      setEditingId(null);
      setEditContent("");
    } catch {
      setActionError(t("comments.saveError"));
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiBase}/comments/${confirmId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== confirmId));
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-1 text-sm text-dark-purple/50 hover:text-girly-purple transition"
      >
        <ChevronDown size={14} />
        {t("comments.show")}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(false)}
        className="flex items-center gap-1 text-sm text-dark-purple/50 hover:text-girly-purple transition"
      >
        <ChevronUp size={14} />
        {t("comments.hide")}
      </button>

      {actionError && (
        <p className="text-xs text-red-500 font-medium">{actionError}</p>
      )}

      {comments.length === 0 && (
        <p className="text-sm text-dark-purple/40">{t("comments.none")}</p>
      )}

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {comments.map((c) => {
          const isOwner = session?.user?.id === c.author.id;
          const isEditing = editingId === c.id;

          return (
            <div key={c.id} className="flex gap-2">
              <UserAvatar user={c.author} size={28} />
              <div className="flex-1 bg-cream rounded-lg px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <Link
                      href={`/profile/${c.author.id}`}
                      className="text-sm font-semibold text-dark-purple hover:text-girly-purple hover:underline transition truncate"
                    >
                      {c.author.username}
                    </Link>
                    <span className="text-[10px] text-dark-purple/40 shrink-0">
                      {timeAgo(c.createdAt, locale)}
                    </span>
                  </div>

                  {isOwner && !isEditing && (
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setMenuOpenId(menuOpenId === c.id ? null : c.id)
                        }
                        aria-label={t("post.options")}
                        className="p-1 rounded-full text-dark-purple/40 hover:text-dark-purple hover:bg-light-pink/40 transition"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {menuOpenId === c.id && (
                        <>
                          <button
                            type="button"
                            aria-hidden
                            tabIndex={-1}
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setMenuOpenId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 z-20 w-36 rounded-lg border border-light-pink bg-white shadow-lg py-1">
                            <button
                              type="button"
                              onClick={() => startEdit(c)}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-dark-purple hover:bg-cream transition"
                            >
                              <Pencil size={12} /> {t("comments.edit")}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMenuOpenId(null);
                                setConfirmId(c.id);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition"
                            >
                              <Trash2 size={12} /> {t("comments.delete")}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-1.5 space-y-1.5">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-light-pink bg-white px-2.5 py-1.5 text-sm text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple resize-y"
                      placeholder={t("comments.editPlaceholder")}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(c.id)}
                        disabled={savingId === c.id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-girly-purple text-white text-xs font-semibold hover:bg-strong-purple transition disabled:opacity-50"
                      >
                        {savingId === c.id && (
                          <Loader2 size={12} className="animate-spin" />
                        )}
                        {t("comments.save")}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1 rounded-full border border-light-pink text-dark-purple/60 text-xs font-semibold hover:bg-cream transition"
                      >
                        {t("comments.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-dark-purple/70 mt-0.5">
                    {c.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t("comments.placeholder")}
          className="flex-1 rounded-lg border border-[#E5E0D9] bg-cream px-3 py-1.5 text-sm text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple"
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="px-2.5 py-1.5 rounded-lg bg-girly-purple text-white hover:bg-strong-purple transition disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </form>

      <ConfirmDialog
        open={confirmId !== null}
        message={t("comments.confirmDelete")}
        busy={deleting}
        onCancel={() => setConfirmId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
