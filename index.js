const http = require('http');
const { Pool } = require('pg');

const port = 8080;

// Đọc thông tin kết nối từ Biến Môi Trường
const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};

// Tạo pool kết nối
const pool = new Pool(dbConfig);

const server = http.createServer(async (req, res) => {
    try {
        // Thử kết nối và truy vấn
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()'); // Truy vấn thời gian
        const time = result.rows[0].now;
        client.release();

        // Trả về nếu thành công
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`CICD  DATABASE THANH CONG!\n\nThoi gian DB server: ${time}\n`);

    } catch (err) {
        // Trả về nếu thất bại
        console.error('Loi ket noi DB:', err.message);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`LOI KET NOI DATABASE:\n\n${err.message}\n`);
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    console.log('Dang ket noi den DB host:', dbConfig.host);
});