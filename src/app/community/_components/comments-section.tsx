"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { timeAgo, getInitial, getAvatarColor, CommentData } from "./helpers";
import { useI18n } from "@/lib/i18n";

interface CommentsSectionProps {
  apiBase: string;
  onCommentAdded?: () => void;
}

export function CommentsSection({ apiBase, onCommentAdded }: CommentsSectionProps) {
  const { t, locale } = useI18n();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

      {comments.length === 0 && (
        <p className="text-sm text-dark-purple/40">{t("comments.none")}</p>
      )}

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${getAvatarColor(c.author.username)}`}
            >
              {getInitial(c.author.username)}
            </div>
            <div className="flex-1 bg-cream rounded-lg px-3 py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-dark-purple">
                  {c.author.username}
                </span>
                <span className="text-[10px] text-dark-purple/40">
                  {timeAgo(c.createdAt, locale)}
                </span>
              </div>
              <p className="text-sm text-dark-purple/70 mt-0.5">{c.content}</p>
            </div>
          </div>
        ))}
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
    </div>
  );
}
