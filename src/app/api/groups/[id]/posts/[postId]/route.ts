import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function loadOwnedPost(groupId: string, postId: string, userId: string) {
  const post = await prisma.groupPost.findUnique({ where: { id: postId } });
  if (!post || post.groupId !== groupId) return { error: "not_found" as const };
  if (post.authorId !== userId) return { error: "forbidden" as const };
  return { post };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id: groupId, postId } = await params;
    const owned = await loadOwnedPost(groupId, postId, session.user.id);
    if (owned.error === "not_found") {
      return NextResponse.json(
        { data: null, error: "Post not found" },
        { status: 404 }
      );
    }
    if (owned.error === "forbidden") {
      return NextResponse.json(
        { data: null, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { title, content } = await req.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { data: null, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.groupPost.update({
      where: { id: postId },
      data: { title: title.trim(), content: content.trim() },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ data: updated, error: null });
  } catch (err) {
    console.error("PUT /api/groups/[id]/posts/[postId] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id: groupId, postId } = await params;
    const owned = await loadOwnedPost(groupId, postId, session.user.id);
    if (owned.error === "not_found") {
      return NextResponse.json(
        { data: null, error: "Post not found" },
        { status: 404 }
      );
    }
    if (owned.error === "forbidden") {
      return NextResponse.json(
        { data: null, error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.groupPost.delete({ where: { id: postId } });

    return NextResponse.json({ data: { id: postId }, error: null });
  } catch (err) {
    console.error("DELETE /api/groups/[id]/posts/[postId] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
