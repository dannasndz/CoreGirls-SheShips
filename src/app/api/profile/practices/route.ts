import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  validatePracticeDates,
  PRACTICE_DATE_ERROR_MESSAGES,
} from "@/lib/practices-validation";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const practicas = await prisma.practicaProfesional.findMany({
      where: { userId: session.user.id },
      orderBy: { fechaInicio: "desc" },
    });

    return NextResponse.json({ data: practicas, error: null });
  } catch (err) {
    console.error("GET /api/profile/practices error:", err);
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

    if (user?.userType !== "ALUMNA") {
      return NextResponse.json(
        { data: null, error: "Only Alumna users can register practices" },
        { status: 403 }
      );
    }

    const { empresa, area, fechaInicio, fechaFin } = await req.json();

    if (!empresa?.trim() || !area?.trim() || !fechaInicio) {
      return NextResponse.json(
        { data: null, error: "Company, area and start date are required" },
        { status: 400 }
      );
    }

    const start = new Date(fechaInicio);
    if (isNaN(start.getTime())) {
      return NextResponse.json(
        { data: null, error: "Invalid start date" },
        { status: 400 }
      );
    }

    let end: Date | null = null;
    if (fechaFin) {
      const parsedEnd = new Date(fechaFin);
      if (isNaN(parsedEnd.getTime())) {
        return NextResponse.json(
          { data: null, error: "Invalid end date" },
          { status: 400 }
        );
      }
      end = parsedEnd;
    }

    const dateError = validatePracticeDates(start, end);
    if (dateError) {
      return NextResponse.json(
        { data: null, error: PRACTICE_DATE_ERROR_MESSAGES[dateError] },
        { status: 400 }
      );
    }

    const practica = await prisma.practicaProfesional.create({
      data: {
        userId: session.user.id,
        empresa: empresa.trim(),
        area: area.trim(),
        fechaInicio: start,
        fechaFin: end,
      },
    });

    return NextResponse.json({ data: practica, error: null }, { status: 201 });
  } catch (err) {
    console.error("POST /api/profile/practices error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
