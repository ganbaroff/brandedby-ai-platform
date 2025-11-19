-- Migration 3: Add database indexes for performance optimization
-- Created: November 19, 2025
-- Purpose: Improve query performance on frequently accessed columns

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_signed_in_at ON users(last_signed_in_at);

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_celebrity_id ON projects(celebrity_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Payments table indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON projects(id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Files table indexes
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_file_type ON files(file_type);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);

-- Celebrities table indexes
CREATE INDEX IF NOT EXISTS idx_celebrities_popularity ON celebrities(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_celebrities_rating ON celebrities(rating DESC);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_projects_user_status ON projects(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_user_created ON payments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_project_type ON files(project_id, file_type);
CREATE INDEX IF NOT EXISTS idx_users_email_created ON users(email, created_at DESC);
