import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  try {
    const { postId } = await params;
    const comments = await prisma.groupPostComment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        author: { select: { id: true, username: true } },
      },
    });

    return NextResponse.json({ data: comments, error: null });
  } catch (err) {
    console.error("GET group post comments error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await params;
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { data: null, error: "Content is required" },
        { status: 400 }
      );
    }

    const comment = await prisma.groupPostComment.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        postId,
      },
      include: {
        author: { select: { id: true, username: true } },
      },
    });

    return NextResponse.json({ data: comment, error: null }, { status: 201 });
  } catch (err) {
    console.error("POST group post comment error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
