"use client";

import Link from "next/link";
import { FileText, Heart, MessageSquare } from "lucide-react";
import { formatDate } from "./types";
import type { PostItem } from "./types";
import { useI18n } from "@/lib/i18n";

interface PostsCardProps {
  posts: PostItem[];
}

export default function PostsCard({ posts }: PostsCardProps) {
  const { t } = useI18n();

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <h2 className="text-lg font-extrabold text-dark-purple font-heading">
          {t("profile.posts")}
        </h2>
        {posts.length > 0 && (
          <span className="text-xs font-bold text-hot-pink bg-hot-pink/10 px-2.5 py-0.5 rounded-full">
            {posts.length}
          </span>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href="/community"
              className="block bg-white rounded-2xl shadow-md ring-1 ring-gray-100
                px-5 py-4 hover:shadow-lg hover:ring-hot-pink/20
                transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-dark-purple font-semibold text-[15px] group-hover:text-hot-pink transition-colors leading-snug">
                  {post.title}
                </p>
                <span className="text-dark-purple/30 text-[11px] shrink-0 mt-0.5">
                  {formatDate(post.createdAt)}
                </span>
              </div>

              <p className="text-dark-purple/50 text-sm leading-relaxed line-clamp-3 mt-2">
                {post.content}
              </p>

              {post.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="bg-girly-purple/8 text-girly-purple text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-100 text-xs">
                <span className="flex items-center gap-1.5 text-hot-pink font-semibold">
                  <Heart className="w-3.5 h-3.5" />
                  {post._count.likes}
                </span>
                <span className="flex items-center gap-1.5 text-cute-orange font-semibold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {post._count.comments}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md ring-1 ring-gray-100 text-center py-14 px-6">
          <div className="w-12 h-12 rounded-2xl bg-hot-pink/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-hot-pink" />
          </div>
          <p className="text-dark-purple/50 text-sm mb-2">{t("profile.noPostsYet")}</p>
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-hot-pink text-sm font-semibold hover:underline"
          >
            {t("profile.startConversation")}
          </Link>
        </div>
      )}
    </div>
  );
}
