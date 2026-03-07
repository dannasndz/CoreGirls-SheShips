import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const careerMap: Record<string, string> = {
  A: "Software Developer",
  B: "UX/UI Designer",
  C: "Data Scientist",
  D: "Project Manager",
};

function scoreAnswers(answers: Record<string, number>): string {
  const tally: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

  for (const optionIndex of Object.values(answers)) {
    const key = ["A", "B", "C", "D"][optionIndex] ?? "A";
    tally[key]++;
  }

  const topKey = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
  return careerMap[topKey];
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

    const { answers } = await req.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { data: null, error: "Answers are required" },
        { status: 400 }
      );
    }

    const career = scoreAnswers(answers);

    const result = await prisma.quizResult.upsert({
      where: { userId: session.user.id },
      update: { answers, career },
      create: {
        userId: session.user.id,
        answers,
        career,
      },
    });

    return NextResponse.json({ data: { career: result.career }, error: null });
  } catch {
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
