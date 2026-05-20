const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'myteacher.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    credit_balance INTEGER DEFAULT 10,
    total_credits_purchased INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Ensure required columns exist on users (safe migrations)
try {
  const userColumns = db.prepare("PRAGMA table_info('users')").all().map(c => c.name);

  if (!userColumns.includes('credit_balance')) {
    db.exec("ALTER TABLE users ADD COLUMN credit_balance INTEGER DEFAULT 10");
    db.exec("UPDATE users SET credit_balance = COALESCE(credit_balance, 10)");
  }

  if (!userColumns.includes('total_credits_purchased')) {
    db.exec("ALTER TABLE users ADD COLUMN total_credits_purchased INTEGER DEFAULT 0");
    db.exec("UPDATE users SET total_credits_purchased = COALESCE(total_credits_purchased, 0)");
  }

  if (!userColumns.includes('created_at')) {
    db.exec("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP");
  }

  if (!userColumns.includes('updated_at')) {
    db.exec("ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP");
  }
} catch (e) {
  console.warn('User table migration warning:', e.message);
}

// Create user_uploads table to track uploads per user
db.exec(`
  CREATE TABLE IF NOT EXISTS user_uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    document_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Create user_videos table to track generated videos per user
db.exec(`
  CREATE TABLE IF NOT EXISTS user_videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    video_filename TEXT NOT NULL,
    video_path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Create credit_packages table
db.exec(`
  CREATE TABLE IF NOT EXISTS credit_packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    price REAL NOT NULL,
    is_active INTEGER DEFAULT 1,
    bonus_credits INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create transactions table
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('PURCHASE', 'DEBIT', 'REFUND', 'BONUS')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    payment_id INTEGER,
    status TEXT DEFAULT 'COMPLETED' CHECK(status IN ('PENDING', 'COMPLETED', 'FAILED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (payment_id) REFERENCES payments(id)
  )
`);

// Create payments table
db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    transaction_id INTEGER,
    package_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'usd',
    payment_method TEXT DEFAULT 'STRIPE' CHECK(payment_method IN ('STRIPE', 'PAYPAL')),
    payment_intent_id TEXT UNIQUE,
    status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES credit_packages(id)
  )
`);

// Create video_generations table
db.exec(`
  CREATE TABLE IF NOT EXISTS video_generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    transaction_id INTEGER,
    credits_used INTEGER NOT NULL,
    duration_seconds INTEGER,
    resolution TEXT,
    options TEXT,
    status TEXT DEFAULT 'PROCESSING' CHECK(status IN ('PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    video_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
  )
`);

console.log('Database initialized successfully');

// Export db first to avoid circular dependency issues
module.exports = db;

// Seed default credit packages
const { seedCreditPackages } = require('./seedPackages');
seedCreditPackages(db);
