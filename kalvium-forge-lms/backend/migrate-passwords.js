/**
 * One-time migration: re-hash any plain-text passwords already in the DB with bcrypt.
 * Run once after switching to bcrypt:  node migrate-passwords.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./services/db.service');

const SALT_ROUNDS = 10;

async function migratePasswords() {
    console.log('🔐 Starting password migration...');

    const students = await db.all('SELECT id, email, password FROM students');

    let migrated = 0;
    for (const student of students) {
        // Skip rows that are already bcrypt hashes (they start with "$2b$" or "$2a$")
        if (student.password.startsWith('$2b$') || student.password.startsWith('$2a$')) {
            console.log(`  ⏩ ${student.email} — already hashed, skipping.`);
            continue;
        }

        const hashed = await bcrypt.hash(student.password, SALT_ROUNDS);
        await db.run('UPDATE students SET password = ? WHERE id = ?', [hashed, student.id]);
        console.log(`  ✅ ${student.email} — migrated.`);
        migrated++;
    }

    console.log(`\n✅ Done! ${migrated} password(s) migrated to bcrypt hashes.`);
    process.exit(0);
}

migratePasswords().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
