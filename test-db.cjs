const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Swaggyswaggy123%23@db.argiroqmigyudozmjocd.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected successfully:', res.rows);
    
    // Check if users table exists
    const tableRes = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    console.log('Users table exists:', tableRes.rows[0].exists);
  } catch (error) {
    console.error('Error connecting to DB:', error);
  } finally {
    await pool.end();
  }
}

test();
