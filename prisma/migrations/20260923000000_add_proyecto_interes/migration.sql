-- CreateTable
CREATE TABLE "ProyectoInteres" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "ProyectoInteres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProyectoInteres_userId_proyectoId_key" ON "ProyectoInteres"("userId", "proyectoId");

-- AddForeignKey
ALTER TABLE "ProyectoInteres" ADD CONSTRAINT "ProyectoInteres_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoInteres" ADD CONSTRAINT "ProyectoInteres_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
