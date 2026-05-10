const {createComment, getComments} = require('../services/commentService');
const parseBody = require('../utils/parseBody');


const handleCreateComment = async (req, res) => {

    try{
        const {content} = await parseBody(req);
        const userId = req.user.id;
        const postId = req.url.split('/')[2];
        const comment = await createComment(postId, userId, content);
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Comment created successfully', comment }));  
    } catch (error) {
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
       res.end(JSON.stringify({ message: 'Error creating comment', error: error.message }));
    }
};

const handleGetComments = async (req,res) => {

    try{
        const postId = req.url.split('/')[2];
        const comments = await getComments(postId);
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Comments retrieved successfully', comments }));  
    } catch (error) {
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Error retrieving comments', error: error.message }));

    }
};

module.exports = {
    handleCreateComment,
    handleGetComments
};