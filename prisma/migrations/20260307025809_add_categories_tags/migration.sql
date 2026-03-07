-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "categories" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "tags" JSONB NOT NULL DEFAULT '[]';
