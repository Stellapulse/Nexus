const pool = require('../config/db');

const createComment = async (postId, userId , content) => {
    const client = await pool.connect();
    try{
        if(!content || content.trim() === ''){
            throw new Error('Content cannot be empty'); 
        }
        await client.query('BEGIN');

        const result = await client.query(
             `INSERT INTO comments (post_id, user_id, content)
             VALUES ($1,$2,$3)
             RETURNING *`,
             [postId, userId, content]
        );

        const post = await client.query(
            `SELECT user_id FROM posts WHERE id=$1`,
            [postId]
        );
        const reciepientId = post.rows[0].user_id;
        if(reciepientId !== userId){
            await client.query(
                `INSERT INTO notifications (recipient_id, sender_id, post_id, type)
                 VALUES ($1, $2, $3, 'comment')`,
                 [reciepientId, userId, postId]
            );
        }

        await client.query('COMMIT');
        return result.rows[0];

    } catch (err){
         await client.query('ROLLBACK');
         console.error("DB insert error:", err);
        
         throw err;
    } finally {
        client.release();
    }
};

const getComments = async (postId) => {
    const result = await pool.query(
        `SELECT comments.id, comments.content, comments.created_at,
                users.email AS author
         FROM comments
         JOIN users ON comments.user_id = users.id
         WHERE comments.post_id = $1
         ORDER BY comments.created_at ASC`,
        [postId]
        

    );
    return result.rows;
};

module.exports = {
    createComment,
    getComments
};