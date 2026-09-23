export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_TYPES = ["ACADEMICA", "EGRESADA"];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const typesParam = searchParams.get("types");
    const limitParam = Number(searchParams.get("limit"));
    const limit =
      Number.isInteger(limitParam) && limitParam > 0
        ? Math.min(limitParam, 50)
        : 20;

    const types = typesParam
      ? typesParam
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : DEFAULT_TYPES;

    const users = await prisma.user.findMany({
      where: {
        userType: { in: types as ("ALUMNA" | "ACADEMICA" | "EGRESADA")[] },
        ...(search
          ? {
              OR: [
                { username: { contains: search, mode: "insensitive" } },
                { fullName: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        userType: true,
      },
      orderBy: { username: "asc" },
      take: limit,
    });

    return NextResponse.json({ data: users, error: null });
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
