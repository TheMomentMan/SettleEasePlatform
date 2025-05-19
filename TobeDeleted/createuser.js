const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

// === EDIT THESE VALUES ===
const username = 'victor';
const email = 'vicman@example.com';
const password = 'vicman'; // Set your desired password here

// === DB CONNECTION SETTINGS (edit if needed) ===
const dbConfig = {
  host: 'db', // use 'db' if running inside a container, 'localhost' if running from Codespaces terminal
  user: 'settleease',
  password: 'settleease_password',
  database: 'settleease_db',
  port: 3306,
};

async function createUser() {
  try {
    const password_hash = await bcrypt.hash(password, 10);

    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [username, email, password_hash]
    );

    console.log('User created with ID:', result.insertId);

    await connection.end();
  } catch (err) {
    console.error('Error creating user:', err);
  }
}

createUser();