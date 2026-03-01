const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

// Ensure this matches the exact name of your database file
const dbPath = path.resolve(__dirname, '../kalviumlabs_forge.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to kalviumlabs_forge.sqlite');
    }
});

// Wrap sqlite3 methods in promises so we can use async/await in our routes
module.exports = {
    get: promisify(db.get).bind(db),       // Fetches a single row
    all: promisify(db.all).bind(db),       // Fetches multiple rows
    run: promisify(db.run).bind(db),       // Executes INSERT/UPDATE
    db: db                                 // The raw database instance
};