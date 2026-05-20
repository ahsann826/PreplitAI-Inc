/**
 * Seed default credit packages
 */
function seedCreditPackages(db) {
  const packages = [
    { name: 'Starter', credits: 50, price: 9.99, bonus_credits: 0 },
    { name: 'Pro', credits: 150, price: 24.99, bonus_credits: 10 },
    { name: 'Business', credits: 500, price: 79.99, bonus_credits: 50 },
    { name: 'Enterprise', credits: 2000, price: 299.99, bonus_credits: 200 }
  ];

  const existingCount = db.prepare('SELECT COUNT(*) as count FROM credit_packages').get();
  
  if (existingCount.count === 0) {
    const insert = db.prepare(`
      INSERT INTO credit_packages (name, credits, price, bonus_credits, is_active)
      VALUES (?, ?, ?, ?, 1)
    `);

    const insertMany = db.transaction((packages) => {
      for (const pkg of packages) {
        insert.run(pkg.name, pkg.credits, pkg.price, pkg.bonus_credits);
      }
    });

    insertMany(packages);
    console.log('✅ Credit packages seeded successfully');
  } else {
    console.log('ℹ️  Credit packages already exist, skipping seed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  const db = require('./database');
  seedCreditPackages(db);
}

module.exports = { seedCreditPackages };
