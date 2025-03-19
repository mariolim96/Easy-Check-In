-- Create properties table first
CREATE TABLE IF NOT EXISTS "properties" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(255) NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "has_sciaa_license" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Then create alloggiati_configs table
CREATE TABLE IF NOT EXISTS "alloggiati_configs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ws_key" TEXT NOT NULL,
    "comune_codice" TEXT NOT NULL,
    "token" TEXT,
    "token_issued" TIMESTAMP,
    "token_expires" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("property_id")
);

CREATE TABLE IF NOT EXISTS "apartments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create index for better query performance

CREATE TABLE IF NOT EXISTS "bookings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "apartment_id" UUID NOT NULL REFERENCES "apartments"("id") ON DELETE CASCADE,
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "guest_count" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "external_id" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "guests" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_number" TEXT NOT NULL,
    "document_scan" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "alloggiati_submissions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
    "booking_id" UUID NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
    "submission_date" TIMESTAMP NOT NULL,
    "receipt_url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "response_data" JSONB,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "tourist_tax_reports" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_guests" INTEGER NOT NULL,
    "total_nights" INTEGER NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_properties_user_id ON "properties"("user_id");
CREATE INDEX idx_alloggiati_configs_property_id ON "alloggiati_configs"("property_id");
CREATE INDEX idx_apartments_property_id ON "apartments"("property_id");
CREATE INDEX idx_bookings_apartment_id ON "bookings"("apartment_id");
CREATE INDEX idx_guests_booking_id ON "guests"("booking_id");
CREATE INDEX idx_alloggiati_submissions_property_id ON "alloggiati_submissions"("property_id");
CREATE INDEX idx_alloggiati_submissions_booking_id ON "alloggiati_submissions"("booking_id");
CREATE INDEX idx_tourist_tax_reports_property_id ON "tourist_tax_reports"("property_id");


