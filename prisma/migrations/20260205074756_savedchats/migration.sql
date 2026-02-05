-- CreateTable
CREATE TABLE "public"."SavedChat" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "context" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedChat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SavedChat" ADD CONSTRAINT "SavedChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
