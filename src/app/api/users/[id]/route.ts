import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        quizResult: {
          select: { career: true, createdAt: true },
        },
        _count: { select: { posts: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { data: null, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user, error: null });
  } catch {
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
