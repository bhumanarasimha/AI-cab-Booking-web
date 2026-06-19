import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'database_sqlite.json');

// In-memory data store structure mimicking the SQL tables
let databaseState = {
    users: []
};

/**
 * Helper: Load database contents from disk.
 */
function loadDB() {
    try {
        if (fs.existsSync(dbPath)) {
            const fileContent = fs.readFileSync(dbPath, 'utf8');
            databaseState = JSON.parse(fileContent);
        } else {
            saveDB();
        }
    } catch (e) {
        console.error("[Database] Error loading database file:", e);
    }
}

/**
 * Helper: Save database contents to disk.
 */
function saveDB() {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(databaseState, null, 2), 'utf8');
    } catch (e) {
        console.error("[Database] Error writing database to file:", e);
    }
}

/**
 * Initializes the users database.
 */
export function dbInit() {
    return new Promise((resolve) => {
        loadDB();
        // Insert a default user if database is empty to maintain parity
        if (databaseState.users.length === 0) {
            databaseState.users.push({
                id: 1,
                name: 'Venkat R.',
                email: 'venkat.r@office.com',
                phone: '9876543210',
                wallet_balance: 850.00,
                pref_cost: 0.4,
                pref_time: 0.3,
                pref_comfort: 0.3,
                is_verified: 1
            });
            saveDB();
        }
        console.log("[Database] Persistent user table initialized in database_sqlite.json.");
        resolve();
    });
}

/**
 * Find user details by email (simulating: SELECT * FROM users WHERE email = ?).
 */
export function getUserByEmail(email) {
    return new Promise((resolve) => {
        loadDB();
        const user = databaseState.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        resolve(user || null);
    });
}

/**
 * Create a new user record (simulating: INSERT INTO users ...).
 */
export function createUser(name, email, phone) {
    return new Promise((resolve, reject) => {
        loadDB();
        
        // Emulate SQL UNIQUE constraint
        if (databaseState.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            reject(new Error("UNIQUE constraint failed: users.email"));
            return;
        }

        const id = databaseState.users.length > 0 
            ? Math.max(...databaseState.users.map(u => u.id)) + 1 
            : 1;

        const newUser = {
            id,
            name,
            email,
            phone,
            wallet_balance: 500.0, // Welcome signup bonus
            pref_cost: 0.4,
            pref_time: 0.3,
            pref_comfort: 0.3,
            is_verified: 1
        };

        databaseState.users.push(newUser);
        saveDB();
        console.log(`[Database] User created. ID: ${id}, Email: ${email}`);
        resolve(newUser);
    });
}

/**
 * Update user details (simulating: UPDATE users SET ... WHERE email = ?).
 */
export function updateUserProfile(email, name, preferences, walletBalance) {
    return new Promise((resolve) => {
        loadDB();
        const index = databaseState.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (index === -1) {
            resolve(0); // 0 rows updated
            return;
        }

        const user = databaseState.users[index];
        if (name !== undefined) user.name = name;
        if (preferences) {
            if (preferences.cost !== undefined) user.pref_cost = preferences.cost;
            if (preferences.time !== undefined) user.pref_time = preferences.time;
            if (preferences.comfort !== undefined) user.pref_comfort = preferences.comfort;
        }
        if (walletBalance !== undefined) user.wallet_balance = walletBalance;

        databaseState.users[index] = user;
        saveDB();
        resolve(1); // 1 row updated
    });
}
