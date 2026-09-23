export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageProject } from "@/lib/projects-validation";
import {
  countAccepted,
  loadProjectEncargadaIds,
  PROJECT_USER_SELECT,
} from "@/lib/projects-api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id, requestId } = await params;
    const project = await loadProjectEncargadaIds(id);
    if (!project) {
      return NextResponse.json(
        { data: null, error: "Project not found" },
        { status: 404 }
      );
    }
    if (!canManageProject(session.user.id, project.encargadaIds)) {
      return NextResponse.json(
        { data: null, error: "Only encargadas can manage requests" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const estado = body?.estado;
    if (estado !== "aceptada" && estado !== "rechazada") {
      return NextResponse.json(
        { data: null, error: "Invalid request status" },
        { status: 400 }
      );
    }

    const existing = await prisma.proyectoSolicitud.findFirst({
      where: { id: requestId, proyectoId: id },
    });
    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Request not found" },
        { status: 404 }
      );
    }

    if (estado === "aceptada" && project.cupoMaximo != null) {
      const accepted = await countAccepted(id, requestId);
      if (accepted >= project.cupoMaximo) {
        return NextResponse.json(
          { data: null, error: "Project is full" },
          { status: 400 }
        );
      }
    }

    const solicitud = await prisma.proyectoSolicitud.update({
      where: { id: requestId },
      data: { estado, decidedAt: new Date() },
      select: {
        id: true,
        estado: true,
        message: true,
        createdAt: true,
        decidedAt: true,
        userId: true,
        user: { select: PROJECT_USER_SELECT },
      },
    });

    return NextResponse.json({ data: solicitud, error: null });
  } catch (err) {
    console.error("PUT /api/projects/[id]/requests/[requestId] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
