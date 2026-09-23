export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canExpressInterest } from "@/lib/projects-validation";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true },
    });

    if (!canExpressInterest(user?.userType)) {
      return NextResponse.json(
        { data: null, error: "Only Alumna users can express interest" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const project = await prisma.proyecto.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!project) {
      return NextResponse.json(
        { data: null, error: "Project not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.proyectoInteres.findUnique({
      where: { userId_proyectoId: { userId: session.user.id, proyectoId: id } },
    });

    if (existing) {
      await prisma.proyectoInteres.delete({ where: { id: existing.id } });
    } else {
      await prisma.proyectoInteres.create({
        data: { userId: session.user.id, proyectoId: id },
      });
    }

    const count = await prisma.proyectoInteres.count({
      where: { proyectoId: id },
    });

    return NextResponse.json({
      data: { interested: !existing, count },
      error: null,
    });
  } catch (err) {
    console.error("POST /api/projects/[id]/interest error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
