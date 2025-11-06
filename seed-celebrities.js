import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('.wrangler/state/v3/d1/miniflare-D1DatabaseObject/9472af7dbd816ccdbfbf510cd411f092a41e00e7938be3a3a4c0bad078d9ae4b.sqlite');
const data = JSON.parse(fs.readFileSync('src/shared/celebrities.json', 'utf-8'));

const stmt = db.prepare(`INSERT OR REPLACE INTO celebrities (id, name, role, description, image_url, niches, rating, popularity, created_at, updated_at) VALUES (@id, @name, @role, @description, @image_url, @niches, @rating, @popularity, @created_at, @updated_at)`);
db.transaction(() => {
  for (const celeb of data) {
    stmt.run(celeb);
  }
})();

console.log('Seeded celebrities table successfully.');
