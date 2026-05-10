const parseBody = require('../utils/parseBody');
const authServices = require('../services/authServices');

const signup = async (req,res) =>{
    try {
        const data = await parseBody(req);
        const result = await authServices.signup(data);

        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({message : "Invalid request Body", error: err.message}));
    }
};

const login = async (req,res) => {
    try {
        const data = await parseBody(req);
        const result = await authServices.login(data);   
        res.setHeader('content-type', 'application/json');      
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({message : "Login failed", error: err.message}));
    }
};

const protected = (req,res) => {
    res.setHeader('content-type','application/json');
    res.end(JSON.stringify({
        message : "Protected route accessed successfully",
         user: req.user?.email
        }));    
};

module.exports = {
    signup,
    login,
    protected
};