import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        userType: true,
        fullName: true,
        avatarUrl: true,
        description: true,
        interests: true,
        campus: true,
        carrera: true,
        sector: true,
        areaSTEM: true,
        materias: true,
        ocupacion: true,
        ubicacion: true,
        createdAt: true,
        certificados: {
          select: { id: true, nombre: true, fileUrl: true, uploadedAt: true },
          orderBy: { uploadedAt: "desc" },
        },
        proyectos: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            areasSTEM: true,
            imagenes: true,
            estado: true,
            anio: true,
            fechaPublicacion: true,
            fechaInicio: true,
            fechaFin: true,
            lugar: true,
            modalidad: true,
            cupoMaximo: true,
            perfilInteresadas: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        quizResult: {
          select: { career: true, createdAt: true },
        },
        _count: { select: { posts: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { data: null, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user, error: null });
  } catch (err) {
    console.error("GET /api/users/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
