export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    if (!session) {
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
    const {
      title,
      description,
      modality,
      location,
      meetingLink,
      externalLink,
      date,
      hour,
      participantsLimit,
      organizerName,
    } = body;

    if (!title?.trim() || !description?.trim() || !modality || !date || !hour || !organizerName?.trim()) {
      return NextResponse.json(
        { data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validModalities = ["in-person", "remote", "hybrid"];
    if (!validModalities.includes(modality)) {
      return NextResponse.json(
        { data: null, error: "Invalid modality" },
        { status: 400 }
      );
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        modality,
        location: location?.trim() || null,
        meetingLink: meetingLink?.trim() || null,
        externalLink: externalLink?.trim() || null,
        date: new Date(date),
        hour: hour.trim(),
        participantsLimit: participantsLimit ? Number(participantsLimit) : null,
        organizerName: organizerName.trim(),
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
