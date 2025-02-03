-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL DEFAULT 120,
    "timeSignature" TEXT NOT NULL DEFAULT '4/4',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "isSolo" BOOLEAN NOT NULL DEFAULT false,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "pitch" INTEGER NOT NULL,
    "startTime" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "velocity" INTEGER NOT NULL,
    "instrumentId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TrackCollaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TrackCollaborators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Track_ownerId_idx" ON "Track"("ownerId");

-- CreateIndex
CREATE INDEX "Instrument_trackId_idx" ON "Instrument"("trackId");

-- CreateIndex
CREATE INDEX "Note_instrumentId_idx" ON "Note"("instrumentId");

-- CreateIndex
CREATE INDEX "_TrackCollaborators_B_index" ON "_TrackCollaborators"("B");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrackCollaborators" ADD CONSTRAINT "_TrackCollaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrackCollaborators" ADD CONSTRAINT "_TrackCollaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
