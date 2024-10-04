-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('insert', 'delete');

-- CreateTable
CREATE TABLE "operations" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "chars" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "OperationType" NOT NULL,

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
