// backend/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();


const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    
    ssl: {
        rejectUnauthorized: false
    }
};


console.log('📊 Database Config:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
    ssl: true
});

const pool = mysql.createPool(dbConfig);
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL (Aiven)');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        console.log(`🔌 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);

        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('👉 Check DB username/password');
        } else if (error.code === 'ENOTFOUND') {
            console.error('👉 Check DB host');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('👉 Check DB port or firewall');
        }

        return false;
    }
}

// ✅ Initialize tables
async function initDatabase() {
    const connection = await pool.getConnection();
    try {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                profile_image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS favorite_cities (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                city_name VARCHAR(100) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_favorite (user_id, city_name)
            )
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS alerts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                city_name VARCHAR(100) NOT NULL,
                threshold_value INT NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS search_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                city_name VARCHAR(100) NOT NULL,
                aqi INT,
                search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ All tables ready');
    } catch (error) {
        console.error('❌ DB init error:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// ✅ Start connection + init
(async () => {
    const connected = await testConnection();
    if (connected) {
        await initDatabase();
    } else {
        console.error('❌ Cannot start without DB');
        process.exit(1);
    }
})();

export default pool;