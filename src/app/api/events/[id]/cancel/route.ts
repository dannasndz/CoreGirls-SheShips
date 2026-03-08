export const runtime = "nodejs";

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

    const { id } = await params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json(
        { data: null, error: "Event not found" },
        { status: 404 }
      );
    }
    if (event.createdById !== session.user.id) {
      return NextResponse.json(
        { data: null, error: "Only the creator can cancel this event" },
        { status: 403 }
      );
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { cancelled: !event.cancelled },
      include: {
        createdBy: { select: { id: true, username: true } },
        _count: { select: { attendees: true } },
      },
    });

    return NextResponse.json({ data: updated, error: null });
  } catch (err) {
    console.error("POST /api/events/[id]/cancel error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
