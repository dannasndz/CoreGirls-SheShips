"use client";

interface RightSidebarProps {
  tags: string[];
}

export function RightSidebar({ tags }: RightSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Trending Topics */}
      <div className="rounded-2xl bg-white border border-light-pink p-4 shadow-sm">
        <h3 className="text-sm font-bold text-girly-purple mb-3 font-[family-name:var(--font-fredoka)]">
          Trending Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-dark-purple font-medium hover:text-girly-purple cursor-pointer transition"
              >
                #{tag}
              </span>
            ))
          ) : (
            <p className="text-xs text-dark-purple/40">
              No tags yet -- add some to your posts!
            </p>
          )}
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
  );
}
