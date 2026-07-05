const { Pool } = require('pg');

// ── Startup Validation ────────────────────────────────────────────────────────
// Prefer individual PG* env vars over DATABASE_URL because passwords containing
// special characters (e.g. #) cause ERR_INVALID_URL when embedded in a URL string.
// If only DATABASE_URL is set, fall back to it.
const hasIndividualVars = process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD;

if (!hasIndividualVars && !process.env.DATABASE_URL) {
  console.error('FATAL: No database credentials found.');
  console.error('Set either PGHOST + PGUSER + PGPASSWORD + PGDATABASE + PGPORT,');
  console.error('or DATABASE_URL, in your environment variables.');
  process.exit(1);
}

const poolConfig = hasIndividualVars
  ? {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '6543', 10),
      database: process.env.PGDATABASE || 'postgres',
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,   // ← plain text, no URL encoding needed
      ssl: { rejectUnauthorized: false }
    }
  : {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    };

const pool = new Pool(poolConfig);


const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        credit_balance INTEGER DEFAULT 10,
        total_credits_purchased INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_uploads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        document_id VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_videos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        video_filename VARCHAR(255) NOT NULL,
        video_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS credit_packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        credits INTEGER NOT NULL,
        price DECIMAL NOT NULL,
        is_active INTEGER DEFAULT 1,
        bonus_credits INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        transaction_id INTEGER,
        package_id INTEGER NOT NULL REFERENCES credit_packages(id),
        amount DECIMAL NOT NULL,
        currency VARCHAR(10) DEFAULT 'usd',
        payment_method VARCHAR(50) DEFAULT 'STRIPE',
        payment_intent_id VARCHAR(255) UNIQUE,
        stripe_event_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        amount INTEGER NOT NULL,
        balance_after INTEGER NOT NULL,
        description TEXT,
        payment_id INTEGER REFERENCES payments(id),
        status VARCHAR(50) DEFAULT 'COMPLETED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS video_generations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        transaction_id INTEGER REFERENCES transactions(id),
        credits_used INTEGER NOT NULL,
        duration_seconds INTEGER,
        resolution VARCHAR(50),
        options TEXT,
        status VARCHAR(50) DEFAULT 'PROCESSING',
        video_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        data TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        result TEXT,
        error TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add stripe_event_id column if it doesn't exist (for idempotency)
    await pool.query(`
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_event_id VARCHAR(255)
    `);

    console.log('Database initialized successfully');
    
    // Seed default credit packages
    const { seedCreditPackages } = require('./seedPackages');
    await seedCreditPackages(pool);
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initializeDatabase();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
