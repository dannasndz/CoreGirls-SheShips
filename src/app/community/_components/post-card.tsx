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
    <article className="rounded-2xl bg-white border border-[#E5E0D9] p-3 sm:p-4 md:p-5 shadow-sm space-y-2 sm:space-y-3">
      {/* Author header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm ${getAvatarColor(post.author.username)}`}
          >
            {getInitial(post.author.username)}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-dark-purple">
              {post.author.username}
            </p>
            <p className="text-xs text-dark-purple/50">
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
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
              {cat}
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

      {/* Content */}
      <h2 className="text-sm sm:text-base md:text-xl font-bold text-dark-purple">{post.title}</h2>
      <p className="-mt-2 text-xs sm:text-sm md:text-lg text-dark-purple/70 leading-relaxed">
        {post.content}
      </p>

      {/* Actions */}
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

      {/* Comments */}
      <CommentsSection
        apiBase={commentsApiBase}
        onCommentAdded={() => setCommentCount((c) => c + 1)}
      />
    </article>
  );
}
