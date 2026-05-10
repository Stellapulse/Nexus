const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET;

const verifyToken = (req,res,next) =>  {
  
    
    try{
        const decoded = jwt.verify(req.token,secret_key);
        console.log('decoded:', decoded);
        req.user = decoded;
        next();

    }
    catch(err){
         console.error('verify error:', err.message);
        res.statusCode = 403;
        res.end(JSON.stringify({message : "Invalid or expired token"}));
        return;
    }
};

module.exports = verifyToken;