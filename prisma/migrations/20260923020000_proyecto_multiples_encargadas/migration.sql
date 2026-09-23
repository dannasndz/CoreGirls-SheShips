-- CreateTable: relación muchos-a-muchos entre proyectos y usuarias encargadas
CREATE TABLE "_ProyectoToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProyectoToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProyectoToUser_B_index" ON "_ProyectoToUser"("B");

-- Migrate existing single encargada into the join table
INSERT INTO "_ProyectoToUser" ("A", "B")
SELECT "id", "encargadaId" FROM "Proyecto" WHERE "encargadaId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- DropForeignKey
ALTER TABLE "Proyecto" DROP CONSTRAINT "Proyecto_encargadaId_fkey";

-- AlterTable
ALTER TABLE "Proyecto" DROP COLUMN "encargadaId";

-- AddForeignKey
ALTER TABLE "_ProyectoToUser" ADD CONSTRAINT "_ProyectoToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProyectoToUser" ADD CONSTRAINT "_ProyectoToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
