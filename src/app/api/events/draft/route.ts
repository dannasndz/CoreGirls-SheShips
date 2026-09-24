export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Devuelve el borrador más reciente de la usuaria autenticada (o null).
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const draft = await prisma.event.findFirst({
      where: { createdById: session.user.id, estado: "BORRADOR" },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { attendees: true } },
      },
    });

    return NextResponse.json({ data: draft, error: null });
  } catch (err) {
    console.error("GET /api/events/draft error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
