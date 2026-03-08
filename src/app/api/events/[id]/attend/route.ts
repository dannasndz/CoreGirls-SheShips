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

    const { id: eventId } = await params;

    // Check if already attending
    const existing = await prisma.eventAttendee.findUnique({
      where: { userId_eventId: { userId: session.user.id, eventId } },
    });

    if (existing) {
      // Un-attend
      await prisma.eventAttendee.delete({ where: { id: existing.id } });
      return NextResponse.json({ data: { attending: false }, error: null });
    }

    // Check participant limit
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { attendees: true } } },
    });

    if (!event) {
      return NextResponse.json(
        { data: null, error: "Event not found" },
        { status: 404 }
      );
    }

    if (event.participantsLimit && event._count.attendees >= event.participantsLimit) {
      return NextResponse.json(
        { data: null, error: "Event is full" },
        { status: 409 }
      );
    }

    await prisma.eventAttendee.create({
      data: { userId: session.user.id, eventId },
    });

    return NextResponse.json({ data: { attending: true }, error: null });
  } catch (err) {
    console.error("POST /api/events/[id]/attend error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
