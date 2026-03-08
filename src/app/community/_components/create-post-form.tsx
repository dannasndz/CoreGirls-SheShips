"use client";

import { useState } from "react";
import { X, Hash } from "lucide-react";
import { STEM_CATEGORIES } from "./helpers";
import { useI18n } from "@/lib/i18n";

interface CreatePostFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    categories: string[];
    tags: string[];
  }) => Promise<boolean>;
  onCancel: () => void;
  placeholder?: string;
}

export function CreatePostForm({
  onSubmit,
  onCancel,
  placeholder,
}: CreatePostFormProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, "");
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPosting(true);
    try {
      const ok = await onSubmit({ title, content, categories, tags });
      if (ok) {
        setTitle("");
        setContent("");
        setCategories([]);
        setTags([]);
        setTagInput("");
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white border border-light-pink p-5 shadow-sm space-y-4"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("createPost.titlePlaceholder")}
        className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder ?? t("createPost.contentPlaceholder")}
        rows={3}
        className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-sm resize-none"
        required
      />

      {/* Categories */}
      <div>
        <p className="text-xs font-semibold text-dark-purple/60 mb-2">
          {t("createPost.categories")}
        </p>
        <div className="flex flex-wrap gap-2">
          {STEM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                categories.includes(cat)
                  ? "bg-girly-purple text-white"
                  : "bg-light-pink/30 text-dark-purple hover:bg-light-pink/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs font-semibold text-dark-purple/60 mb-2">{t("createPost.tags")}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-light-pink/40 text-strong-purple text-xs font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() =>
                    setTags((prev) => prev.filter((t) => t !== tag))
                  }
                  className="hover:text-hot-pink transition"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="relative">
          <Hash
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-purple/30"
          />
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={addTag}
            placeholder={t("createPost.tagPlaceholder")}
            className="w-full rounded-lg border border-light-pink bg-cream pl-8 pr-3 py-1.5 text-dark-purple placeholder:text-dark-purple/40 focus:outline-none focus:ring-2 focus:ring-girly-purple text-xs"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 rounded-lg text-sm text-dark-purple/60 hover:bg-light-pink/30 transition"
        >
          {t("createPost.cancel")}
        </button>
        <button
          type="submit"
          disabled={posting}
          className="px-4 py-1.5 rounded-lg bg-girly-purple text-white text-sm font-semibold hover:bg-strong-purple transition disabled:opacity-50"
        >
          {posting ? t("createPost.posting") : t("createPost.post")}
        </button>
      </div>
    </form>
  );
}
