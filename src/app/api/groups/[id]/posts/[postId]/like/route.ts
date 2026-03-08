import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
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
    const userId = session.user.id;

    const existing = await prisma.groupPostLike.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.groupPostLike.delete({ where: { id: existing.id } });
      return NextResponse.json({ data: { liked: false }, error: null });
    }

    await prisma.groupPostLike.create({ data: { userId, postId } });
    return NextResponse.json({ data: { liked: true }, error: null });
  } catch (err) {
    console.error("POST group post like error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
