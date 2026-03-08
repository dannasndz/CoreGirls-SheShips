import { NextResponse } from "next/server";
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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        createdAt: true,
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
          orderBy: { createdAt: "desc" },
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
          orderBy: { joinedAt: "desc" },
        },
        events: {
          select: {
            id: true,
            title: true,
            date: true,
            hour: true,
            modality: true,
            cancelled: true,
          },
          orderBy: { date: "desc" },
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
                cancelled: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
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
      },
    });

    if (!user) {
      return NextResponse.json(
        { data: null, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user, error: null });
  } catch {
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
