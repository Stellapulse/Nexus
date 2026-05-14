const pool = require('../config/db');
const AppError = require('../core/AppError');




const createPost = async (userId, data) => {
    const { title, content } = data;
    
    if(!content){
        throw new AppError('content is required', 400);
    }

    try {
        const result = await pool.query(
            'INSERT INTO posts (user_id, title, content) VALUES($1, $2, $3) RETURNING *',
            [userId , title , content]
        );

        return result.rows[0];
    } catch (err){
        console.error("DB insert error:", err);
        throw new AppError('Error occurred while creating post', 500);
    }

};

const getFeed = async (page, limit) => {
    
    try {
        const offset = (page - 1) * limit;
        const result = await pool.query(
          `SELECT posts.id, posts.title, posts.content, posts.created_at,
           users.email AS author,
           COUNT(DISTINCT comments.id) AS comments_count,
           COUNT(DISTINCT likes.id) AS likes_count
           FROM posts
           JOIN users ON posts.user_id = users.id
           LEFT JOIN comments ON posts.id = comments.post_id
           LEFT JOIN likes ON posts.id = likes.post_id
           GROUP BY posts.id,posts.title,posts.content,posts.created_at,users.email
           ORDER BY posts.created_at DESC
           LIMIT $1 OFFSET $2`,
           [limit+1, offset]
        );
        const hasMore = result.rows.length >limit;

        return {
            posts:(hasMore ? result.rows.slice(0, limit) : result.rows).map(post =>({
                ...post,                
                likes_count: parseInt(post.likes_count),
                comments_count: parseInt(post.comments_count)

            })),
            hasMore 
        }

    } catch (err){
        console.error("DB query error:", err);
        throw new AppError('Error occurred while fetching feed', 500);
    }
};
    
module.exports = { createPost , getFeed };