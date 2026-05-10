const {createLikeUnlike , getLikesCount} = require('../services/likeService');


const handleLikeUnlike = async (req, res) =>{
    try{
        const userId = req.user.id;
        const postId = req.url.split('/')[2];
        const result = await createLikeUnlike(postId, userId);
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(result));

    }catch (error){
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Error processing like/unlike', error: error.message }));
    }

};

const handleGetLikesCount = async (req, res) => {
    try {
        const postId = req.url.split('/')[2];   
        const count = await getLikesCount(postId);
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Likes count retrieved successfully', count }));
    } catch (error) {
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Error retrieving likes count', error: error.message }));
    }
};  

module.exports = {
    handleLikeUnlike,
    handleGetLikesCount
};