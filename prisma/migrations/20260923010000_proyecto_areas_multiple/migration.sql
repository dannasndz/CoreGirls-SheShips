-- AlterTable: área STEM pasa de valor único (enum) a selección múltiple (JSON array)
ALTER TABLE "Proyecto" ADD COLUMN "areasSTEM" JSONB DEFAULT '[]';

-- Migrate existing single area into the new array column
UPDATE "Proyecto"
SET "areasSTEM" = jsonb_build_array("areaSTEM"::text)
WHERE "areaSTEM" IS NOT NULL;

-- AlterTable
ALTER TABLE "Proyecto" DROP COLUMN "areaSTEM";
