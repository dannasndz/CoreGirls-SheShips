import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;

    // Run session + posts fetch in parallel to avoid sequential cold-start penalty
    const [session, posts] = await Promise.all([
      getServerSession(authOptions),
      prisma.groupPost.findMany({
        where: { groupId },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true } },
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
    console.error("GET group posts error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: groupId } = await params;

    // Check membership
    const membership = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: session.user.id, groupId } },
    });
    if (!membership) {
      return NextResponse.json(
        { data: null, error: "You must be a group member to post" },
        { status: 403 }
      );
    }

    const { title, content, categories, tags } = await req.json();

    if (!title?.trim() || !content?.trim()) {
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

    const post = await prisma.groupPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        categories: cleanCategories,
        tags: cleanTags,
        authorId: session.user.id,
        groupId,
      },
      include: {
        author: { select: { id: true, username: true } },
      },
    });

    return NextResponse.json({ data: post, error: null }, { status: 201 });
  } catch (err) {
    console.error("POST group post error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
