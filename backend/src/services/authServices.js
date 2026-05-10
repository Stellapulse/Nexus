const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('../config/db');
const fs = require('fs');

const secret_key = process.env.JWT_SECRET;

const signup = async (data) => {
    if(!data.email  || !data.password){
        throw new Error('Email and password are required');
    }
  
    const existUSer = await pool.query('SELECT * FROM users Where email= $1',[data.email]);
    if(existUSer.rows.length >0){
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password,12);

    try {
     await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [data.email, hashedPassword]);
     console.log("User inserted:", data.email);
    } catch (err) {
        console.error("DB insert error:", err);
        throw err;
   }
 
    return { message: 'User registered successfully',user :data.email };
};

const login = async(data) => {
    if(!data.email || !data.password){
        throw new Error('Email and password are required');
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1',[data.email]);
    const user = result.rows[0];
    if(!user){
        throw new Error('Invalid Email or Password');
    }

    const match = await bcrypt.compare(data.password,user.password);
    if(!match){
        throw new Error('Invalid Email or Password');
    }

    const token = jwt.sign({id:user.id,email:user.email},secret_key,{expiresIn:'1h'});
    return { message: 'Login successful', user:user.email,token };
};

module.exports = {signup, login};