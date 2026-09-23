export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canManageProject,
  normalizeEncargadaIds,
  validateProjectInput,
} from "@/lib/projects-validation";
import {
  loadProjectEncargadaIds,
  projectInclude,
  solicitudInclude,
} from "@/lib/projects-api";

export async function PUT(
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
    if (!canManageProject(session.user.id, project.encargadaIds)) {
      return NextResponse.json(
        { data: null, error: "Only encargadas can edit this project" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = validateProjectInput(body);
    if (!result.ok) {
      return NextResponse.json(
        { data: null, error: result.message },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = { ...result.data };

    if (body.encargadaIds !== undefined) {
      const encargadaIds = normalizeEncargadaIds(
        body.encargadaIds,
        session.user.id
      );
      const found = await prisma.user.findMany({
        where: { id: { in: encargadaIds } },
        select: { id: true },
      });
      if (found.length !== encargadaIds.length) {
        return NextResponse.json(
          { data: null, error: "One or more encargadas were not found" },
          { status: 400 }
        );
      }
      data.encargadas = { set: encargadaIds.map((eid) => ({ id: eid })) };
    }

    const updated = await prisma.proyecto.update({
      where: { id },
      data,
      include: {
        ...projectInclude,
        interesadas: { where: { userId: session.user.id }, select: { id: true } },
        solicitudes: solicitudInclude,
      },
    });

    const { interesadas, solicitudes, ...rest } = updated;
    const isEncargada = rest.encargadas.some((e) => e.id === session.user.id);
    const mine = solicitudes.find((s) => s.userId === session.user.id) ?? null;

    return NextResponse.json({
      data: {
        ...rest,
        interestedByMe: interesadas.length > 0,
        acceptedCount: solicitudes.filter((s) => s.estado === "aceptada").length,
        mySolicitud: mine ? { id: mine.id, estado: mine.estado } : null,
        solicitudes: isEncargada ? solicitudes : [],
      },
      error: null,
    });
  } catch (err) {
    console.error("PUT /api/projects/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
