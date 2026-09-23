-- AlterTable: fecha de publicación, fechas de inicio/fin opcionales e imágenes
ALTER TABLE "Proyecto"
ADD COLUMN     "fechaFin" TIMESTAMP(3),
ADD COLUMN     "fechaInicio" TIMESTAMP(3),
ADD COLUMN     "fechaPublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imagenes" JSONB DEFAULT '[]';

-- Backfill: conservar la fecha previa como fecha de publicación y de inicio
UPDATE "Proyecto"
SET "fechaPublicacion" = COALESCE("fecha", "createdAt"),
    "fechaInicio" = "fecha"
WHERE "fecha" IS NOT NULL;

-- AlterTable
ALTER TABLE "Proyecto" DROP COLUMN "fecha";

-- CreateTable: solicitudes de ingreso
CREATE TABLE "ProyectoSolicitud" (
    "id" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "ProyectoSolicitud_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProyectoSolicitud_userId_proyectoId_key" ON "ProyectoSolicitud"("userId", "proyectoId");

-- AddForeignKey
ALTER TABLE "ProyectoSolicitud" ADD CONSTRAINT "ProyectoSolicitud_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoSolicitud" ADD CONSTRAINT "ProyectoSolicitud_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
