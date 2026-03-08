import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ hasCompleted: false });
  }

  const result = await prisma.quizResult.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  return NextResponse.json({ hasCompleted: !!result });
}
