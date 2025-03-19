-- Add name column to properties table
ALTER TABLE "properties"
ADD COLUMN "name" TEXT NOT NULL DEFAULT '';

-- Remove the default constraint after adding the column
ALTER TABLE "properties"
ALTER COLUMN "name"
DROP DEFAULT;