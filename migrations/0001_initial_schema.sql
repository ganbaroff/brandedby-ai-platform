-- Migration number: 0001 	 2024-05-24T12:00:00.000Z
DROP TABLE IF EXISTS celebrities;
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS blog_posts;

CREATE TABLE celebrities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  niches TEXT NOT NULL, -- JSON string
  rating REAL DEFAULT 0,
  popularity INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_azeri INTEGER DEFAULT 0, -- boolean 0 or 1
  preview_url TEXT,
  emoji TEXT DEFAULT '📄',
  status TEXT DEFAULT 'active', -- active, draft, archived
  usage_count INTEGER DEFAULT 0,
  tags TEXT, -- JSON string array
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL,
  publishedAt TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Seed initial data for Celebrities
INSERT INTO celebrities (name, role, description, image_url, niches, rating, popularity) VALUES 
('Taylor Swift', 'Singer-Songwriter', 'Global music superstar and songwriter', 'https://images.unsplash.com/photo-1494790108755-2616c27ac65b?w=400&h=400&fit=crop&crop=face&auto=format&q=80', '["Entertainment", "Music", "Pop Culture"]', 9.8, 10),
('Ryan Reynolds', 'Actor & Producer', 'Canadian-American actor and producer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80', '["Entertainment", "Comedy", "Action Films"]', 9.2, 9),
('Zendaya', 'Actress & Singer', 'American actress and singer', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80', '["Entertainment", "Fashion", "Youth Culture"]', 9.5, 9);

-- Seed initial data for Blog Posts
INSERT INTO blog_posts (title, content, excerpt, image_url, author, publishedAt, category) VALUES
('AI Photography Revolution', '<p>Artificial intelligence is fundamentally changing the way we create and process photographs...</p>', 'How AI technologies are transforming photography and video production', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&auto=format&q=80', 'BrandedBy Team', '2025-11-06', 'Technology'),
('Creating Personal Videos with Celebrities', '<p>Learn how our platform allows you to create unique videos...</p>', 'Step-by-step guide to creating AI videos with selfies', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop&auto=format&q=80', 'Alex Johnson', '2025-11-05', 'Tutorial');
