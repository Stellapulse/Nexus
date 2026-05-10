require('dotenv').config();
const http = require('http');
const router = require('./router');
console.log('router loaded');
const pool = require('../config/db');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    router(req, res);
});

server.listen(PORT,() => { //port ?
    console.log(`server is listening on port ${PORT}`);
});

    