import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
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
    const userId = session.user.id;

    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      return NextResponse.json(
        { data: null, error: "Group not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });

    if (existing) {
      // Leave the group
      await prisma.groupMember.delete({ where: { id: existing.id } });
      return NextResponse.json({ data: { joined: false }, error: null });
    }

    // Join the group
    await prisma.groupMember.create({
      data: { userId, groupId },
    });
    return NextResponse.json({ data: { joined: true }, error: null });
  } catch (err) {
    console.error("POST group join error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
