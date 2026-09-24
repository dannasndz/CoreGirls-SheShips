export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateEventInput } from "@/lib/events-validation";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, username: true } },
        attendees: {
          include: { user: { select: { id: true, username: true } } },
        },
        _count: { select: { attendees: true } },
      },
    });

    if (!event) {
      return NextResponse.json(
        { data: null, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: event, error: null });
  } catch (err) {
    console.error("GET /api/events/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Event not found" },
        { status: 404 }
      );
    }
    if (existing.createdById !== session.user.id) {
      return NextResponse.json(
        { data: null, error: "Only the creator can edit this event" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = validateEventInput(body);
    if (!result.ok) {
      return NextResponse.json(
        { data: null, error: result.message },
        { status: 400 }
      );
    }

    const organizerName =
      (typeof body.organizerName === "string" && body.organizerName.trim()) ||
      existing.organizerName;

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: result.data.title,
        description: result.data.description,
        modality: result.data.modalityDb,
        location: result.data.location,
        meetingLink: result.data.meetingLink,
        externalLink: result.data.externalLink,
        date: result.data.date,
        hour: result.data.hour,
        participantsLimit: result.data.participantsLimit,
        imageUrl: result.data.imageUrl,
        estado: result.data.estadoDb,
        organizerName,
      },
      include: {
        createdBy: { select: { id: true, username: true } },
        _count: { select: { attendees: true } },
      },
    });

    return NextResponse.json({ data: event, error: null });
  } catch (err) {
    console.error("PUT /api/events/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Event not found" },
        { status: 404 }
      );
    }
    if (existing.createdById !== session.user.id) {
      return NextResponse.json(
        { data: null, error: "Only the creator can delete this event" },
        { status: 403 }
      );
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ data: { id }, error: null });
  } catch (err) {
    console.error("DELETE /api/events/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
