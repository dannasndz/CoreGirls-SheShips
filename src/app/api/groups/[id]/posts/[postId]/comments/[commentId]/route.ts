import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function loadOwnedComment(
  postId: string,
  commentId: string,
  userId: string
) {
  const comment = await prisma.groupPostComment.findUnique({
    where: { id: commentId },
  });
  if (!comment || comment.postId !== postId) return { error: "not_found" as const };
  if (comment.authorId !== userId) return { error: "forbidden" as const };
  return { comment };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string; commentId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { postId, commentId } = await params;
    const owned = await loadOwnedComment(postId, commentId, session.user.id);
    if (owned.error === "not_found") {
      return NextResponse.json(
        { data: null, error: "Comment not found" },
        { status: 404 }
      );
    }
    if (owned.error === "forbidden") {
      return NextResponse.json(
        { data: null, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json(
        { data: null, error: "Content is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.groupPostComment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ data: updated, error: null });
  } catch (err) {
    console.error("PUT group comment error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string; commentId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { postId, commentId } = await params;
    const owned = await loadOwnedComment(postId, commentId, session.user.id);
    if (owned.error === "not_found") {
      return NextResponse.json(
        { data: null, error: "Comment not found" },
        { status: 404 }
      );
    }
    if (owned.error === "forbidden") {
      return NextResponse.json(
        { data: null, error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.groupPostComment.delete({ where: { id: commentId } });

    return NextResponse.json({ data: { id: commentId }, error: null });
  } catch (err) {
    console.error("DELETE group comment error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
