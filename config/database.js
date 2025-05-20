const mysql = require('mysql2/promise');

// === Add this block before creating the pool ===
console.log('Connecting to MySQL with:', {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'settleease_user',
    database: process.env.DB_NAME || 'settleease',
    port: process.env.DB_PORT
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'settleease_user',
    password: process.env.DB_PASSWORD || 'settleease_password',
    database: process.env.DB_NAME || 'settleease',
    port: process.env.DB_PORT || 3306, // Default MySQL port
    waitForConnections: true,
    connectionLimit: 10,    
    queueLimit: 0,
    // Add these for better connection handling in Codespaces
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test database connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connection successful');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        // Don't exit the process, let the application handle the error
        throw error;
    }
};

// Export both pool and test function
module.exports = {
    pool,
    testConnection
}; 