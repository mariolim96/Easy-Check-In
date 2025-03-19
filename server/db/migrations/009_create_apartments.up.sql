-- Create the apartments table
CREATE TABLE IF NOT EXISTS "apartments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX idx_apartments_property_id ON "apartments"("property_id");