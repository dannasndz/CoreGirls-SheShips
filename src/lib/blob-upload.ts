"use client";

import { upload } from "@vercel/blob/client";
import { buildBlobPathname, type UploadCategory } from "./blob-path";

export async function uploadFile(
  file: File,
  options: { userId: string; category: UploadCategory }
): Promise<string> {
  const pathname = buildBlobPathname(options.userId, options.category, file.name);
  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/profile/upload",
    clientPayload: JSON.stringify({ category: options.category }),
    contentType: file.type || undefined,
  });
  return blob.url;
}
