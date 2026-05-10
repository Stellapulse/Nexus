const { createPost , getFeed} = require('../services/postService');
const parseBody = require('../utils/parseBody');
const url = require('url');

const handleCreatePost = async (req, res) => {
    try{
        const data = await parseBody(req);
        const userId = req.user.id;
        const post = await createPost(userId, data);
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Post created successfully', post }));
    }
    catch (error){
        res.end(JSON.stringify({ message: 'Error creating post', error }));
    }
};

const handleGetFeed = async (req, res) => {
    try {
        const parsed = url.parse(req.url,true);
        const page = parseInt(parsed.query.page)||1;
        const limit = parseInt(parsed.query.limit)||10;
        const {posts, hasMore} = await getFeed(page, limit);
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Feed retrieved successfully', 
            page,
            limit,
            posts,
            hasMore
        }));   
    }
    catch (error){
        res.statusCode = 500;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'Error retrieving feed', error }));
    }
};

module.exports = { handleCreatePost , handleGetFeed };