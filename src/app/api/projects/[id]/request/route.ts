export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageProject, getJoinBlockReason, JOIN_BLOCK_MESSAGES } from "@/lib/projects-validation";
import { countAccepted, loadProjectEncargadaIds } from "@/lib/projects-api";

const BLOCK_STATUS: Record<string, number> = {
  encargada: 400,
  cerrado: 400,
  fecha_fin: 400,
  lleno: 400,
  pendiente: 409,
  miembro: 409,
};

export async function POST(
  req: NextRequest,
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
    const { id } = await params;
    const project = await loadProjectEncargadaIds(id);
    if (!project) {
      return NextResponse.json(
        { data: null, error: "Project not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.proyectoSolicitud.findUnique({
      where: { userId_proyectoId: { userId: session.user.id, proyectoId: id } },
    });
    const acceptedCount = await countAccepted(id);

    const blockReason = getJoinBlockReason({
      isEncargada: canManageProject(session.user.id, project.encargadaIds),
      estado: project.estado,
      cupoMaximo: project.cupoMaximo,
      acceptedCount,
      fechaFin: project.fechaFin,
      existingEstado: (existing?.estado as "pendiente" | "aceptada" | "rechazada") ?? null,
    });
    if (blockReason) {
      return NextResponse.json(
        { data: null, error: JOIN_BLOCK_MESSAGES[blockReason] },
        { status: BLOCK_STATUS[blockReason] ?? 400 }
      );
    }

    let message: string | null = null;
    try {
      const body = await req.json();
      if (typeof body?.message === "string") {
        message = body.message.trim().slice(0, 500) || null;
      }
    } catch {
      // body is optional
    }

    const solicitud = existing
      ? await prisma.proyectoSolicitud.update({
          where: { id: existing.id },
          data: { estado: "pendiente", message, decidedAt: null },
        })
      : await prisma.proyectoSolicitud.create({
          data: { userId: session.user.id, proyectoId: id, message },
        });

    return NextResponse.json({ data: solicitud, error: null }, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects/[id]/request error:", err);
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
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const existing = await prisma.proyectoSolicitud.findUnique({
      where: { userId_proyectoId: { userId: session.user.id, proyectoId: id } },
    });
    if (!existing || existing.estado !== "pendiente") {
      return NextResponse.json(
        { data: null, error: "No pending request found" },
        { status: 404 }
      );
    }

    await prisma.proyectoSolicitud.delete({ where: { id: existing.id } });
    return NextResponse.json({ data: { id }, error: null });
  } catch (err) {
    console.error("DELETE /api/projects/[id]/request error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
