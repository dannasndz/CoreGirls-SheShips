import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const certificados = await prisma.certificado.findMany({
      where: { userId: session.user.id },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json({ data: certificados, error: null });
  } catch (err) {
    console.error("GET /api/profile/certificates error:", err);
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
    const { nombre, fileUrl } = await req.json();

    if (!nombre?.trim() || !fileUrl?.trim()) {
      return NextResponse.json(
        { data: null, error: "Name and file URL are required" },
        { status: 400 }
      );
    }

    const certificado = await prisma.certificado.create({
      data: {
        userId: session.user.id,
        nombre: nombre.trim(),
        fileUrl: fileUrl.trim(),
      },
    });

    return NextResponse.json({ data: certificado, error: null }, { status: 201 });
  } catch (err) {
    console.error("POST /api/profile/certificates error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
