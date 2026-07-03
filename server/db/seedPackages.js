/**
 * Seed default credit packages
 */
async function seedCreditPackages(db) {
  const packages = [
    { name: 'Starter', credits: 50, price: 9.99, bonus_credits: 0 },
    { name: 'Pro', credits: 150, price: 24.99, bonus_credits: 10 },
    { name: 'Business', credits: 500, price: 79.99, bonus_credits: 50 },
    { name: 'Enterprise', credits: 2000, price: 299.99, bonus_credits: 200 }
  ];

  const result = await db.query('SELECT COUNT(*) as count FROM credit_packages');
  const existingCount = parseInt(result.rows[0].count, 10);
  
  if (existingCount === 0) {
    for (const pkg of packages) {
      await db.query(`
        INSERT INTO credit_packages (name, credits, price, bonus_credits, is_active)
        VALUES ($1, $2, $3, $4, 1)
      `, [pkg.name, pkg.credits, pkg.price, pkg.bonus_credits]);
    }
    console.log('✅ Credit packages seeded successfully');
  } else {
    console.log('ℹ️  Credit packages already exist, skipping seed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  const db = require('./database');
  seedCreditPackages(db).catch(console.error);
}

module.exports = { seedCreditPackages };
