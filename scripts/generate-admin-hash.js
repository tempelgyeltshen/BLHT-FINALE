const bcrypt = require('../backend/node_modules/bcryptjs');

// Generate a bcrypt hash for your admin password
const email = process.argv[2] || 'tempelgyeltshen12345@gmail.com';
const password = process.argv[3] || 'blht_admin_2026'; // Default password if none provided
const saltRounds = 10;

const hash = bcrypt.hashSync(password, saltRounds);

console.log('==========================================');
console.log('Admin Credentials Generator');
console.log('==========================================');
console.log(`Email: ${email}`);
console.log(`Password: ${password}`);
console.log(`Password Hash: ${hash}`);
console.log('==========================================');
console.log('');
console.log('Add these to your Render environment variables:');
console.log(`ADMIN_EMAIL=${email}`);
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('==========================================');