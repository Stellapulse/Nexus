const authenticate = (req,res,next) =>{
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.statusCode = 401;
        res.end(JSON.stringify({message: "Authorization header is missing or malformed"}));
        return;
    }

    const token = authHeader.split(' ')[1];
    req.token = token;


    if (!token) {
        res.statusCode = 401;
        res.end(JSON.stringify({message : "Authorization token is required" }));
        return;
    }

    //  try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     req.user = decoded;   
    //     next();
    // } catch (err) {
    //     res.statusCode = 403;
    //     res.end(JSON.stringify({ message: "Invalid or expired token" }));
    // }
    
    
   next();

};

module.exports = authenticate;