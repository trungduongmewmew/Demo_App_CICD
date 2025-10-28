const http = require('http');
const { Pool } = require('pg');

const port = 8080;


const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};


const pool = new Pool(dbConfig);

const server = http.createServer(async (req, res) => {
    try {
        
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()'); 
        const time = result.rows[0].now;
        client.release();

        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`CICD Test DATABASE THANH CONG!\n\nThoi gian DB server: ${time}\n`);

    } catch (err) {
        
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