export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Run session + posts fetch in parallel to avoid sequential cold-start penalty
    const [session, posts] = await Promise.all([
      getServerSession(authOptions),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
          _count: { select: { likes: true, comments: true } },
          likes: { select: { userId: true } },
        },
      }),
    ]);

    const userId = session?.user?.id;
    const data = posts.map((p) => ({
      ...p,
      likedByMe: userId ? p.likes.some((l) => l.userId === userId) : false,
      likes: undefined,
    }));

    return NextResponse.json({ data, error: null });
  } catch (err) {
    console.error("GET /api/forum/posts error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, content, categories, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { data: null, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const validCategories = ["Science", "Technology", "Engineer", "Mathematics"];
    const cleanCategories = Array.isArray(categories)
      ? categories.filter((c: string) => validCategories.includes(c))
      : [];
    const cleanTags = Array.isArray(tags)
      ? tags.map((t: string) => t.trim()).filter(Boolean)
      : [];

    const post = await prisma.post.create({
      data: {
        title,
        content,
        categories: cleanCategories,
        tags: cleanTags,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ data: post, error: null }, { status: 201 });
  } catch (err) {
    console.error("POST /api/forum/posts error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
