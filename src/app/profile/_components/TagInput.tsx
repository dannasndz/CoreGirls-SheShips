"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ values, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const value = input.trim();
    if (value && !values.includes(value)) {
      onChange([...values, value]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(values.filter((v) => v !== tag));
  };

  return (
    <div className="w-full rounded-lg border border-light-pink bg-cream px-3 py-2 focus-within:ring-2 focus-within:ring-girly-purple">
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {values.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-girly-purple/10 text-girly-purple text-[11px] font-semibold px-2 py-0.5 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-hot-pink"
                aria-label={`Remove ${tag}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-dark-purple placeholder:text-dark-purple/40 focus:outline-none"
      />
    </div>
  );
}
