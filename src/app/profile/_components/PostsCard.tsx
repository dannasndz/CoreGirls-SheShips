import Link from "next/link";
import { ParticleCard } from "@/components/MagicBento";
import { FileText, Heart, MessageSquare } from "lucide-react";
import { formatDate, GLOW_COLOR, cardStyle, cardClass } from "./types";
import type { PostItem } from "./types";

interface PostsCardProps {
  posts: PostItem[];
}

export default function PostsCard({ posts }: PostsCardProps) {
  return (
    <ParticleCard
      className={cardClass}
      style={cardStyle}
      glowColor={GLOW_COLOR}
      enableTilt={false}
      clickEffect
      particleCount={6}
    >
      <div className="p-2">
        <div className="flex items-center gap-2 text-white text-s mb-3">
          <FileText className="w-4 h-4" />
          <span>Recent Posts</span>
        </div>
        {posts.length > 0 ? (
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
            {posts.map((post) => (
              <Link
                key={post.id}
                href="/community"
                className="block rounded-lg bg-white/8 px-3 py-2.5 hover:bg-white/15 transition-colors"
              >
                <p className="text-white text-[13px] font-semibold truncate">
                  {post.title}
                </p>
                <p className="text-white/50 text-[13px] leading-snug line-clamp-2 mt-1">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1 text-hot-pink">
                    <Heart className="w-3 h-3" />
                    {post._count.likes}
                  </span>
                  <span className="flex items-center gap-1 text-cute-orange">
                    <MessageSquare className="w-3 h-3" />
                    {post._count.comments}
                  </span>
                  <span className="text-white/40 ml-auto">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-girly-purple/40 text-sm">No posts yet</p>
        )}
      </div>
    </ParticleCard>
  );
}
