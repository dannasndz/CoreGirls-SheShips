"use client";

import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { timeAgo, getInitial, getAvatarColor, PostData } from "./helpers";
import { CommentsSection } from "./comments-section";

interface PostCardProps {
  post: PostData;
  onLike: (postId: string) => void;
  commentsApiBase: string;
}

export function PostCard({ post, onLike, commentsApiBase }: PostCardProps) {
  const [commentCount, setCommentCount] = useState(post._count.comments);

  return (
    <article className="rounded-2xl bg-white border border-light-pink p-5 shadow-sm space-y-3">
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

      {/* Categories + Tags */}
      {((post.categories ?? []).length > 0 ||
        (post.tags ?? []).length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {(post.categories ?? []).map((cat: string) => (
            <span
              key={cat}
              className="px-2.5 py-0.5 rounded-full bg-strong-purple/10 text-strong-purple text-xs font-semibold"
            >
              {cat}
            </span>
          ))}
          {(post.tags ?? []).map((tag: string) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-light-pink/40 text-girly-purple text-xs font-medium cursor-pointer hover:bg-light-pink/60 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <h3 className="text-base font-bold text-dark-purple">{post.title}</h3>
      <p className="text-sm text-dark-purple/70 leading-relaxed">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-5 pt-2 border-t border-light-pink/50">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 transition text-sm ${
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
        <span className="flex items-center gap-1.5 text-dark-purple/50 text-sm">
          <MessageCircle size={18} />
          {commentCount}
        </span>
      </div>

      {/* Comments */}
      <CommentsSection
        apiBase={commentsApiBase}
        onCommentAdded={() => setCommentCount((c) => c + 1)}
      />
    </article>
  );
}
