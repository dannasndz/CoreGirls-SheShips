import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { UserType, Campus, Prisma } from "@/generated/prisma/client";

const VALID_USER_TYPES = Object.values(UserType);
const VALID_CAMPUSES = Object.values(Campus);

function isValidPassword(pw: string) {
  if (pw.length < 8) return false;
  if (!/[A-Z]/.test(pw)) return false;
  if (!/[0-9]/.test(pw)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      username,
      email,
      password,
      userType,
      fullName,
      birthDate,
      institution = "UABC",
      campus,
      carrera,
      semestre,
      sector,
      ocupacion,
      fechaEgreso,
    } = body;

    if (!username || !email || !password || !userType || !fullName || !birthDate) {
      return NextResponse.json(
        { data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!VALID_USER_TYPES.includes(userType)) {
      return NextResponse.json(
        { data: null, error: "Invalid user type" },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { data: null, error: "Password must be at least 8 characters with one uppercase letter and one number" },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { data: null, error: "Invalid email" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { data: null, error: "Email already registered" },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        { data: null, error: "Username already taken" },
        { status: 409 }
      );
    }

    const parsedBirthDate = new Date(birthDate);
    if (isNaN(parsedBirthDate.getTime())) {
      return NextResponse.json(
        { data: null, error: "Invalid birth date" },
        { status: 400 }
      );
    }

    const createData: Prisma.UserUncheckedCreateInput = {
      username,
      email,
      password: await hashPassword(password),
      userType,
      fullName,
      birthDate: parsedBirthDate,
      institution,
    };

    if (campus && VALID_CAMPUSES.includes(campus)) {
      createData.campus = campus;
    }

    if (userType === "ALUMNA") {
      if (carrera) createData.carrera = carrera;
      if (typeof semestre === "number") createData.semestre = semestre;
    } else if (userType === "ACADEMICA") {
      if (sector) createData.sector = sector;
    } else if (userType === "EGRESADA") {
      if (carrera) createData.carrera = carrera;
      if (ocupacion) createData.ocupacion = ocupacion;
      if (fechaEgreso) {
        const d = new Date(fechaEgreso);
        if (!isNaN(d.getTime())) createData.fechaEgreso = d;
      }
    }

    const user = await prisma.user.create({ data: createData });

    return NextResponse.json(
      { data: { id: user.id, email: user.email, username: user.username }, error: null },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
