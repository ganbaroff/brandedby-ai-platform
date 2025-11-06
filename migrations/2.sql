
-- Add missing columns to users table
ALTER TABLE users ADD COLUMN google_sub TEXT;
ALTER TABLE users ADD COLUMN google_user_data TEXT;
ALTER TABLE users ADD COLUMN last_signed_in_at TIMESTAMP;

-- Add index for google_sub
CREATE INDEX idx_users_google_sub ON users(google_sub);

-- Add selfie_url column to projects for uploaded selfies
ALTER TABLE projects ADD COLUMN selfie_url TEXT;
