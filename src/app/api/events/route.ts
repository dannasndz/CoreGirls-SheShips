export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: {
        createdBy: { select: { id: true, username: true } },
        _count: { select: { attendees: true } },
      },
    });

    return NextResponse.json({ data: events, error: null });
  } catch (err) {
    console.error("GET /api/events error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
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

    if ((modality === "in-person" || modality === "hybrid") && !location?.trim()) {
      return NextResponse.json(
        { data: null, error: "Location is required for in-person/hybrid events" },
        { status: 400 }
      );
    }

    if ((modality === "remote" || modality === "hybrid") && !meetingLink?.trim()) {
      return NextResponse.json(
        { data: null, error: "Meeting link is required for remote/hybrid events" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
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
        createdById: session.user.id,
      },
      include: {
        createdBy: { select: { id: true, username: true } },
        _count: { select: { attendees: true } },
      },
    });

    return NextResponse.json({ data: event, error: null }, { status: 201 });
  } catch (err) {
    console.error("POST /api/events error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
