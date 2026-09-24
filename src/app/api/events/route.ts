export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canCreateEvent,
  validateEventInput,
} from "@/lib/events-validation";

const eventInclude = {
  createdBy: { select: { id: true, username: true, avatarUrl: true } },
  _count: { select: { attendees: true } },
} as const;

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { estado: "PUBLICADO" },
      orderBy: { date: "asc" },
      include: eventInclude,
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
    if (!session?.user?.id) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true, accountStatus: true, isAdmin: true },
    });

    if (!canCreateEvent(user ?? {})) {
      return NextResponse.json(
        {
          data: null,
          error: "You do not have permission to create events",
        },
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
      session.user.name ||
      "Comunidad +Mujeres STEM";

    const event = await prisma.event.create({
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
        createdById: session.user.id,
      },
      include: eventInclude,
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
