-- SQL Database Schema for SmartRide AI
-- Used to save and persist new user details.

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    wallet_balance REAL DEFAULT 500.0,
    pref_cost REAL DEFAULT 0.4,
    pref_time REAL DEFAULT 0.3,
    pref_comfort REAL DEFAULT 0.3,
    is_verified INTEGER DEFAULT 1
);
