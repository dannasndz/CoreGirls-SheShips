-- AlterTable: foto y número estimado de asistentes (opcionales)
ALTER TABLE "Event" ADD COLUMN     "estimatedAttendees" INTEGER,
ADD COLUMN     "imageUrl" TEXT;
