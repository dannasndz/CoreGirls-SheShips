export const UPLOAD_CATEGORIES = ["images", "documents"] as const;
export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

const MAX_FILE_NAME_LENGTH = 180;

export function isUploadCategory(value: string): value is UploadCategory {
  return (UPLOAD_CATEGORIES as readonly string[]).includes(value);
}

export function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  const rawExtension = dot > 0 ? base.slice(dot + 1) : "";
  const rawName = dot > 0 ? base.slice(0, dot) : base;

  const extension = rawExtension.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
  const sanitized = rawName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_FILE_NAME_LENGTH);

  const safeName = sanitized || "archivo";
  return extension ? `${safeName}.${extension}` : safeName;
}

export function buildBlobPathname(
  userId: string,
  category: UploadCategory,
  fileName: string
): string {
  return `users/${userId}/${category}/${sanitizeFileName(fileName)}`;
}

export function parseBlobPathname(
  pathname: string,
  userId: string
): { category: UploadCategory; fileName: string } | null {
  if (pathname.includes("//")) return null;

  const parts = pathname.split("/");
  if (parts.length < 4) return null;

  const [root, id, category, ...rest] = parts;
  if (root !== "users" || id !== userId) return null;
  if (!isUploadCategory(category)) return null;

  const fileName = rest.join("/");
  if (!fileName) return null;

  return { category, fileName };
}
