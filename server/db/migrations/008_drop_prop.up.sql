-- Drop the properties table with CASCADE to handle dependencies
DROP TABLE IF EXISTS "properties" CASCADE;

-- Recreate the properties table with all required columns
CREATE TABLE IF NOT EXISTS "properties" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "has_sciaa_license" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX idx_properties_user_id ON "properties"("user_id");