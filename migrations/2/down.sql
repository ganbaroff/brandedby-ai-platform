
-- Remove selfie_url from projects
ALTER TABLE projects DROP COLUMN selfie_url;

-- Remove index
DROP INDEX idx_users_google_sub;

-- Remove columns from users
ALTER TABLE users DROP COLUMN last_signed_in_at;
ALTER TABLE users DROP COLUMN google_user_data;
ALTER TABLE users DROP COLUMN google_sub;
