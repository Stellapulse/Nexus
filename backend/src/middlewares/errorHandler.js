const AppError = require('../core/AppError');

const errorHandler = (err,res) => {

    if(err.isOperational){
        res.statusCode = err.statusCode;
        res.setHeader('content-type','application/json');
        res.end(JSON.stringify({
            status:'error',
            message: err.message
        }));

        return;
    
    }

    console.error('UNEXPECTED ERROR :',err);
    res.statusCode = 500;
    res.setHeader('content-type','application/json');
    res.end(JSON.stringify({
        status:'error',
        message: 'An unexpected error occurred'
    }));
};


module.exports = errorHandler;