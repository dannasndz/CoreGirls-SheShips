import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { joinedAt: "asc" },
        },
        _count: { select: { members: true, posts: true } },
      },
    });

    if (!group) {
      return NextResponse.json(
        { data: null, error: "Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: group, error: null });
  } catch (err) {
    console.error("GET group error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
