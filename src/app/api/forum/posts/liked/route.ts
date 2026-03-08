export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const likes = await prisma.like.findMany({
      where: { userId: session.user.id },
      include: {
        post: {
          include: {
            author: { select: { id: true, username: true } },
            _count: { select: { likes: true, comments: true } },
          },
        },
      },
    });

    const data = likes
      .map((l) => ({
        ...l.post,
        likedByMe: true,
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json({ data, error: null });
  } catch (err) {
    console.error("GET /api/forum/posts/liked error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
