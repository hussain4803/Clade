-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "timeZone" TEXT NOT NULL,
    "durationLabel" TEXT NOT NULL,
    "durationHours" REAL NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "circuitName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "circuitLengthKm" REAL NOT NULL,
    "circuitTurns" INTEGER NOT NULL,
    "circuitNote" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RaceSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "RaceSession_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RaceResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raceId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "carNumber" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "drivers" TEXT NOT NULL,
    "laps" INTEGER NOT NULL,
    "gap" TEXT NOT NULL,
    "bestLap" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "isTeamEntry" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "RaceResult_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "carNumber" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "rating" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "helmetImage" TEXT NOT NULL,
    "starts" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "podiums" INTEGER NOT NULL,
    "poles" INTEGER NOT NULL,
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "coverAlt" TEXT NOT NULL,
    "readMinutes" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Race_slug_key" ON "Race"("slug");

-- CreateIndex
CREATE INDEX "Race_startDate_idx" ON "Race"("startDate");

-- CreateIndex
CREATE INDEX "Race_series_season_idx" ON "Race"("series", "season");

-- CreateIndex
CREATE INDEX "RaceSession_raceId_order_idx" ON "RaceSession"("raceId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "RaceResult_raceId_position_key" ON "RaceResult"("raceId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_slug_key" ON "Driver"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_number_key" ON "Driver"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt");

-- CreateIndex
CREATE INDEX "Article_category_idx" ON "Article"("category");

-- CreateIndex
CREATE INDEX "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
