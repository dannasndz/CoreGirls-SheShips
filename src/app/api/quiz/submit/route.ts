import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type StemType = "S" | "T" | "E" | "M";

function scoreAnswers(answers: Record<string, StemType>): { topType: StemType; score: Record<StemType, number> } {
  const score: Record<StemType, number> = { S: 0, T: 0, E: 0, M: 0 };

  for (const type of Object.values(answers)) {
    if (score[type] !== undefined) {
      score[type]++;
    }
  }

  const topType = (Object.entries(score) as [StemType, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  return { topType, score };
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

    const { answers, career } = await req.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { data: null, error: "Answers are required" },
        { status: 400 }
      );
    }

    const { topType, score } = scoreAnswers(answers);
    const careerName = career || topType;

    const result = await prisma.quizResult.upsert({
      where: { userId: session.user.id },
      update: { answers: { answers, score, career: careerName }, career: careerName },
      create: {
        userId: session.user.id,
        answers: { answers, score, career: careerName },
        career: careerName,
      },
    });

    return NextResponse.json({ data: { career: result.career, score }, error: null });
  } catch {
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
