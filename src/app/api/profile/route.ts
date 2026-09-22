import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildProfileUpdate } from "@/lib/profile";

const profileSelect = {
  id: true,
  username: true,
  email: true,
  userType: true,
  fullName: true,
  birthDate: true,
  institution: true,
  accountStatus: true,
  isAdmin: true,
  avatarUrl: true,
  description: true,
  interests: true,
  campus: true,
  carrera: true,
  semestre: true,
  clubs: true,
  fechaIngresoAlumna: true,
  sector: true,
  areaSTEM: true,
  materias: true,
  fechaInicioLabor: true,
  ocupacion: true,
  fechaIngreso: true,
  fechaEgreso: true,
  ubicacion: true,
  createdAt: true,
  updatedAt: true,
  certificados: {
    select: { id: true, nombre: true, fileUrl: true, uploadedAt: true },
    orderBy: { uploadedAt: "desc" as const },
  },
  practicas: {
    select: {
      id: true,
      empresa: true,
      area: true,
      fechaInicio: true,
      fechaFin: true,
    },
    orderBy: { fechaInicio: "desc" as const },
  },
  proyectos: {
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      areaSTEM: true,
      estado: true,
      anio: true,
      fecha: true,
      lugar: true,
      modalidad: true,
      cupoMaximo: true,
      perfilInteresadas: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" as const },
  },
  quizResult: {
    select: { career: true, answers: true, createdAt: true },
  },
  posts: {
    select: {
      id: true,
      title: true,
      content: true,
      categories: true,
      createdAt: true,
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" as const },
    take: 10,
  },
  groupMemberships: {
    select: {
      role: true,
      joinedAt: true,
      group: {
        select: { id: true, name: true, description: true },
      },
    },
    orderBy: { joinedAt: "desc" as const },
  },
  events: {
    select: {
      id: true,
      title: true,
      date: true,
      hour: true,
      modality: true,
      estado: true,
    },
    orderBy: { date: "desc" as const },
    take: 10,
  },
  eventAttendances: {
    select: {
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          hour: true,
          modality: true,
          estado: true,
        },
      },
    },
    orderBy: { createdAt: "desc" as const },
    take: 10,
  },
  _count: {
    select: {
      posts: true,
      comments: true,
      likes: true,
      groupMemberships: true,
      events: true,
      eventAttendances: true,
    },
  },
};

export async function GET() {
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
      select: profileSelect,
    });

    if (!user) {
      return NextResponse.json(
        { data: null, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user, error: null });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const current = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true },
    });

    if (!current) {
      return NextResponse.json(
        { data: null, error: "User not found" },
        { status: 404 }
      );
    }

    const body = (await req.json()) as Record<string, unknown>;
    const data = buildProfileUpdate(current.userType, body);

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: profileSelect,
    });

    return NextResponse.json({ data: updated, error: null });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
