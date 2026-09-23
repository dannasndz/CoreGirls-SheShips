import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  validatePracticeDates,
  PRACTICE_DATE_ERROR_MESSAGES,
} from "@/lib/practices-validation";

function parseDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? undefined : d;
}

async function loadOwnedPractice(id: string, userId: string) {
  const practica = await prisma.practicaProfesional.findUnique({ where: { id } });
  if (!practica) return { error: "not_found" as const };
  if (practica.userId !== userId) return { error: "forbidden" as const };
  return { practica };
}

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
    const owned = await loadOwnedPractice(id, session.user.id);
    if (owned.error === "not_found") {
      return NextResponse.json(
        { data: null, error: "Practice not found" },
        { status: 404 }
      );
    }
    if (owned.error === "forbidden") {
      return NextResponse.json(
        { data: null, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body.empresa === "string" && body.empresa.trim())
      data.empresa = body.empresa.trim();
    if (typeof body.area === "string" && body.area.trim())
      data.area = body.area.trim();

    const start = parseDate(body.fechaInicio);
    if (start !== undefined) {
      if (start === null) {
        return NextResponse.json(
          { data: null, error: "Invalid start date" },
          { status: 400 }
        );
      }
      data.fechaInicio = start;
    }

    const end = parseDate(body.fechaFin);
    if (end !== undefined) data.fechaFin = end;

    const effectiveStart = start ?? owned.practica.fechaInicio;
    const effectiveEnd = end !== undefined ? end : owned.practica.fechaFin;

    const dateError = validatePracticeDates(effectiveStart, effectiveEnd);
    if (dateError) {
      return NextResponse.json(
        { data: null, error: PRACTICE_DATE_ERROR_MESSAGES[dateError] },
        { status: 400 }
      );
    }

    const practica = await prisma.practicaProfesional.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: practica, error: null });
  } catch (err) {
    console.error("PUT /api/profile/practices/[id] error:", err);
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
    const owned = await loadOwnedPractice(id, session.user.id);
    if (owned.error === "not_found") {
      return NextResponse.json(
        { data: null, error: "Practice not found" },
        { status: 404 }
      );
    }
    if (owned.error === "forbidden") {
      return NextResponse.json(
        { data: null, error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.practicaProfesional.delete({ where: { id } });

    return NextResponse.json({ data: { id }, error: null });
  } catch (err) {
    console.error("DELETE /api/profile/practices/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
