const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

// Ensure this matches the exact name of your database file
const dbPath = path.resolve(__dirname, '../kalviumlabs_forge.sqlite');

// Explicitly open in read-write mode (+ create if missing) to prevent SQLITE_READONLY errors
const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error('❌ Database connection error:', err.message);
        } else {
            console.log('✅ Connected to kalviumlabs_forge.sqlite (read-write)');
            // Enable WAL mode for better concurrent access and set a 5s busy timeout
            db.serialize(() => {
                db.run('PRAGMA journal_mode = WAL;');
                db.run('PRAGMA busy_timeout = 5000;');
            });
        }
    }
);

// Wrap sqlite3 methods in promises so we can use async/await in our routes
module.exports = {
    get: promisify(db.get).bind(db),       // Fetches a single row
    all: promisify(db.all).bind(db),       // Fetches multiple rows
    run: promisify(db.run).bind(db),       // Executes INSERT/UPDATE
    db: db                                 // The raw database instance
};