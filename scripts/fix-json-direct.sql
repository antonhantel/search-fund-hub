-- Direct SQL script to fix languageRequirements column
-- Run this directly in your PostgreSQL database or through a database client

-- Step 1: Check which jobs have the problem
SELECT id, title, "languageRequirements"::text
FROM "Job"
WHERE "languageRequirements" IS NOT NULL;

-- Step 2: Fix all invalid JSON by converting strings to JSON arrays
-- This updates any non-array values to be wrapped in an array
UPDATE "Job"
SET "languageRequirements" =
  CASE
    WHEN "languageRequirements"::text ~ '^\[.*\]$' THEN "languageRequirements"
    ELSE ('["' || ("languageRequirements"::text) || '"]')::jsonb
  END
WHERE "languageRequirements" IS NOT NULL
  AND NOT ("languageRequirements"::text ~ '^\[.*\]$');

-- Step 3: Verify the fix
SELECT id, title, "languageRequirements"
FROM "Job"
WHERE "languageRequirements" IS NOT NULL;
