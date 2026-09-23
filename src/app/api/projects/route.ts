export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canCreateProject,
  normalizeEncargadaIds,
  validateProjectInput,
} from "@/lib/projects-validation";
import {
  projectInclude,
  solicitudInclude,
} from "@/lib/projects-api";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const userId = session.user.id;
    const projects = await prisma.proyecto.findMany({
      orderBy: { fechaPublicacion: "desc" },
      include: {
        ...projectInclude,
        interesadas: { where: { userId }, select: { id: true } },
        solicitudes: solicitudInclude,
      },
    });

    const data = projects.map(({ interesadas, solicitudes, ...project }) => {
      const isEncargada = project.encargadas.some((e) => e.id === userId);
      const mine = solicitudes.find((s) => s.userId === userId) ?? null;
      return {
        ...project,
        interestedByMe: interesadas.length > 0,
        acceptedCount: solicitudes.filter((s) => s.estado === "aceptada").length,
        mySolicitud: mine ? { id: mine.id, estado: mine.estado } : null,
        solicitudes: isEncargada ? solicitudes : [],
      };
    });

    return NextResponse.json({ data, error: null });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    if (!canCreateProject(user?.userType)) {
      return NextResponse.json(
        {
          data: null,
          error: "Only Maestra/Académica and Egresada users can create projects",
        },
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

    const project = await prisma.proyecto.create({
      data: {
        ...result.data,
        encargadas: { connect: encargadaIds.map((id) => ({ id })) },
      },
      include: { ...projectInclude, solicitudes: solicitudInclude },
    });

    return NextResponse.json(
      {
        data: {
          ...project,
          interestedByMe: false,
          acceptedCount: 0,
          mySolicitud: null,
          solicitudes: [],
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
