import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseBlobPathname, type UploadCategory } from "@/lib/blob-path";

export const runtime = "nodejs";

const CATEGORY_RULES: Record<
  UploadCategory,
  { allowedContentTypes: string[]; maximumSizeInBytes: number }
> = {
  images: {
    allowedContentTypes: ["image/jpeg", "image/png"],
    maximumSizeInBytes: 2 * 1024 * 1024, // 2 MB
  },
  documents: {
    allowedContentTypes: ["application/pdf", "image/jpeg", "image/png"],
    maximumSizeInBytes: 5 * 1024 * 1024, // 5 MB
  },
};

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
          throw new Error("Unauthorized");
        }

        const parsed = parseBlobPathname(pathname, session.user.id);
        if (!parsed) {
          throw new Error("Invalid upload path");
        }

        const rules = CATEGORY_RULES[parsed.category];

        return {
          allowedContentTypes: rules.allowedContentTypes,
          maximumSizeInBytes: rules.maximumSizeInBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            userId: session.user.id,
            category: parsed.category,
          }),
        };
      },
      onUploadCompleted: async () => {
        // El registro en base de datos se crea aparte vía POST /api/profile/certificates
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("POST /api/profile/upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
