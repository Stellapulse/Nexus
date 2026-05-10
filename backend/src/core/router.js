const authController = require('../controllers/authController');
const logger = require('../middlewares/logger');
const verifyToken = require('../middlewares/verifyToken');
const authenticate = require('../middlewares/authenticate');
const { handleCreatePost , handleGetFeed } = require('../controllers/postController');
const { handleCreateComment , handleGetComments } = require('../controllers/commentController');
const {handleLikeUnlike, handleGetLikesCount } = require('../controllers/likeController');


const router =  (req,res) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
  
    if(req.url === '/signup' && req.method === 'POST'){
        authController.signup(req,res);
        return;
    }
    else if(req.url === '/login' && req.method === 'POST'){
        authController.login(req,res);
    }
    else if(req.url === '/protected' && req.method === 'GET'){
        runMiddlewares(req,res,[logger, authenticate, verifyToken],() => {
        authController.protected(req,res);
        });
    }
    else if(req.url === '/posts' && req.method === 'POST'){
        runMiddlewares(req,res,[authenticate, verifyToken ],() => {
        handleCreatePost(req,res);
        });
    }
    else if(req.url.startsWith('/feed') && req.method === 'GET'){
    
        handleGetFeed(req,res);
        
    }
    else if(req.url.match(/^\/posts\/\d+\/comments$/) && req.method === 'POST'){
        runMiddlewares(req,res,[authenticate, verifyToken ],() => {
            handleCreateComment(req,res);
        });     
    }
    else if(req.url.match(/^\/posts\/\d+\/comments$/) && req.method === 'GET'){
        handleGetComments(req,res);
    }
    else if(req.url.match(/^\/posts\/\d+\/likes$/) && req.method === 'POST'){
        runMiddlewares(req,res,[authenticate, verifyToken],()=>{
            handleLikeUnlike(req,res);
        });
    }
    else if(req.url.match(/^\/posts\/\d+\/likes$/) && req.method === 'GET'){
        handleGetLikesCount(req,res);
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({message : "Route not found"}));
    }
};

const runMiddlewares = (req,res,middlewares,finalHandler) => {
    let index = 0;
    const next =() => {
        if(index<middlewares.length){
            const middleware = middlewares[index];
            index++;
            middleware(req,res,next);
        } else {
            finalHandler(req,res);
        };
    }
    next();
};

module.exports = router;