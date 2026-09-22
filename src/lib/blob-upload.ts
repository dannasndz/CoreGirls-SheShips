"use client";

import { upload } from "@vercel/blob/client";

export async function uploadFile(file: File): Promise<string> {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/profile/certificates/upload",
  });
  return blob.url;
}
