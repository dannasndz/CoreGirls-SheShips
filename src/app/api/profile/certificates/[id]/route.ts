import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { del } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

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

    const certificado = await prisma.certificado.findUnique({ where: { id } });
    if (!certificado) {
      return NextResponse.json(
        { data: null, error: "Certificate not found" },
        { status: 404 }
      );
    }

    if (certificado.userId !== session.user.id) {
      return NextResponse.json(
        { data: null, error: "Forbidden" },
        { status: 403 }
      );
    }

    try {
      await del(certificado.fileUrl);
    } catch (blobErr) {
      console.error("Blob delete error:", blobErr);
    }

    await prisma.certificado.delete({ where: { id } });

    return NextResponse.json({ data: { id }, error: null });
  } catch (err) {
    console.error("DELETE /api/profile/certificates/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
