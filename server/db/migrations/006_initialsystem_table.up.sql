-- Create properties table first
CREATE TABLE IF NOT EXISTS "properties" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "user_id" VARCHAR(255) NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "has_sciaa_license" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Then create alloggiaticonfigs table
CREATE TABLE IF NOT EXISTS "alloggiati_configs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "property_id" UUID NOT NULL REFERENCES "properties" ("id") ON DELETE CASCADE,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ws_key" TEXT NOT NULL,
    "token" TEXT,
    "token_issued" TIMESTAMP,
    "token_expires" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("property_id")
);

CREATE TABLE IF NOT EXISTS "apartments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "property_id" UUID NOT NULL REFERENCES "properties" ("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "guest_documents";

DROP TABLE IF EXISTS "guests";

DROP TABLE IF EXISTS "bookings";

DROP TABLE IF EXISTS "alloggiati_submissions";

CREATE TABLE IF NOT EXISTS "bookings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "apartment_id" UUID NOT NULL REFERENCES "apartments" ("id") ON DELETE CASCADE,
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "guest_count" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "external_id" TEXT,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "amount" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "guests" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "first_name" TEXT,
    "last_name" TEXT,
    "gender" TEXT NOT NULL DEFAULT 'M' CHECK (gender IN ('M', 'F')),
    "date_of_birth" DATE,
    "place_of_birth" TEXT,
    "nationality" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "guest_documents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "guest_id" UUID NOT NULL REFERENCES "guests" ("id") ON DELETE CASCADE,
    "document_issue_date" DATE,
    "document_expiry_date" DATE,
    "document_issue_place" TEXT,
    "document_type" TEXT,
    "document_number" TEXT,
    "document_scan" TEXT,
    "document_issue_country" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "alloggiati_submissions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "booking_id" UUID NOT NULL REFERENCES "bookings" ("id") ON DELETE CASCADE,
    "submission_date" TIMESTAMP NOT NULL,
    "status" TEXT NOT NULL,
    "response_data" JSONB,
    "transmitted_data" JSONB,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "booking_guests" (
    "booking_id" UUID NOT NULL REFERENCES "bookings" ("id") ON DELETE CASCADE,
    "guest_id" UUID NOT NULL REFERENCES "guests" ("id") ON DELETE CASCADE,
    "guest_type" TEXT DEFAULT 'group_member' CHECK (
        guest_type IN (
            'group_leader',
            'family_head',
            'single_guest',
            'family_member',
            'group_member'
        )
    ),
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "alloggiati_submission_id" UUID REFERENCES "alloggiati_submissions" ("id"),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("booking_id", "guest_id")
);

CREATE UNIQUE INDEX idx_one_main_guest_per_booking ON "booking_guests" ("booking_id")
WHERE
    guest_type IS NOT NULL;

CREATE INDEX idx_booking_guests_booking_id ON "booking_guests" ("booking_id");

CREATE INDEX idx_booking_guests_guest_id ON "booking_guests" ("guest_id");



--
--     "property_id" UUID NOT NULL REFERENCES "properties" ("id") ON DELETE CASCADE,
--     "booking_id" UUID NOT NULL REFERENCES "bookings" ("id") ON DELETE CASCADE,
--     "group_leader_id" UUID REFERENCES "guests" ("id"),
--     "submission_date" TIMESTAMP NOT NULL,
--     "submission_type" TEXT NOT NULL DEFAULT 'single' CHECK (submission_type IN ('single', 'family', 'group')),
--     "status" TEXT NOT NULL,
--     "response_data" JSONB,
--     "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- ALTER TABLE "alloggiati_submissions"
-- ADD COLUMN IF NOT EXISTS "submission_number" TEXT,
-- ADD COLUMN IF NOT EXISTS "error_details" TEXT,
-- ADD COLUMN IF NOT EXISTS "transmitted_data" JSONB;
-- Add constraint to ensure group_leader_id is set for family/group submissions
-- ALTER TABLE "alloggiati_submissions" ADD CONSTRAINT check_group_leader CHECK (
--     (
--         submission_type = 'single'
--         AND group_leader_id IS NULL
--     )
--     OR (
--         (submission_type IN ('family', 'group'))
--         AND group_leader_id IS NOT NULL
--     )
-- );
CREATE TABLE IF NOT EXISTS "tourist_tax_reports" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "property_id" UUID NOT NULL REFERENCES "properties" ("id") ON DELETE CASCADE,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_guests" INTEGER NOT NULL,
    "total_nights" INTEGER NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensuring you can't add more guests than specified in the booking
-- Preventing modification of the booking's guest count once guests are added
-- Ensuring you can't delete guests without updating the booking's guest count
-- Function to check guest count
-- CREATE OR REPLACE FUNCTION check_booking_guest_count()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     -- For INSERT/DELETE operations
--     IF (TG_OP = 'INSERT' OR TG_OP = 'DELETE') THEN
--         IF (
--             (SELECT COUNT(*) FROM guests WHERE booking_id = NEW.booking_id) != 
--             (SELECT guest_count FROM bookings WHERE id = NEW.booking_id)
--         ) THEN
--             RAISE EXCEPTION 'Number of guests does not match booking guest_count';
--         END IF;
--     END IF;
--     -- For UPDATE operations
--     IF (TG_OP = 'UPDATE') THEN
--         IF (
--             (SELECT COUNT(*) FROM guests WHERE booking_id = NEW.booking_id) != 
--             (SELECT guest_count FROM bookings WHERE id = NEW.booking_id)
--         ) THEN
--             RAISE EXCEPTION 'Number of guests does not match booking guest_count';
--         END IF;
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- -- Create trigger on guests table
-- CREATE TRIGGER enforce_guest_count
-- AFTER INSERT OR UPDATE OR DELETE ON guests
-- FOR EACH ROW
-- EXECUTE FUNCTION check_booking_guest_count();
-- -- Create trigger to prevent booking guest_count updates
-- CREATE OR REPLACE FUNCTION prevent_guest_count_mismatch()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF NEW.guest_count != OLD.guest_count AND 
--        (SELECT COUNT(*) FROM guests WHERE booking_id = NEW.id) > 0 THEN
--         RAISE EXCEPTION 'Cannot modify guest_count when guests are already associated';
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER prevent_booking_guest_count_update
-- BEFORE UPDATE ON bookings
-- FOR EACH ROW
-- EXECUTE FUNCTION prevent_guest_count_mismatch();
-- Create indexes
CREATE INDEX idx_properties_user_id ON "properties" ("user_id");

CREATE INDEX idx_alloggiati_configs_property_id ON "alloggiati_configs" ("property_id");

CREATE INDEX idx_apartments_property_id ON "apartments" ("property_id");

CREATE INDEX idx_bookings_apartment_id ON "bookings" ("apartment_id");

CREATE INDEX idx_bookings_main_guest_id ON "bookings" ("main_guest_id");

CREATE INDEX idx_guests_booking_id ON "guests" ("booking_id");

CREATE INDEX idx_alloggiati_submissions_property_id ON "alloggiati_submissions" ("property_id");

CREATE INDEX idx_alloggiati_submissions_booking_id ON "alloggiati_submissions" ("booking_id");

CREATE INDEX idx_tourist_tax_reports_property_id ON "tourist_tax_reports" ("property_id");