// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try{
//         await mongoose.connect('mongodb://localhost:27017/');
//         console.log('MongoDB connected');
        
//     } catch(err){
//         console.log('DB connection error :',err);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;

//Using postgre 

const {Pool} = require('pg');

const pool = new Pool ({
 user : process.env.DB_USER,
 host : process.env.DB_HOST,
 database : process.env.DB_NAME,
 password : process.env.DB_PASSWORD,
 port : process.env.DB_PORT
});
console.log(process.env.DB_PASSWORD);

pool.on('connect', () => {
    console.log('PostgreSQL connected');
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('DB connection failed:', err.message);
    } else {
        console.log('PostgreSQL connected at:', res.rows[0].now);
    }
});

pool.on('error',(err) => {
    console.error('PostgreSQL connection error :',err);
    process.exit(1);
});

module.exports = pool;