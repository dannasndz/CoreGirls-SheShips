import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { members: true, posts: true } },
      },
    });

    return NextResponse.json({ data: groups, error: null });
  } catch (err) {
    console.error("GET groups error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, description } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { data: null, error: "Group name is required" },
        { status: 400 }
      );
    }

    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        description: description?.trim() ?? "",
        members: {
          create: {
            userId: session.user.id,
            role: "admin",
          },
        },
      },
      include: {
        _count: { select: { members: true, posts: true } },
      },
    });

    return NextResponse.json({ data: group, error: null }, { status: 201 });
  } catch (err) {
    console.error("POST group error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
