const pool = require('../config/db');
const AppError = require('../core/AppError');

const createLikeUnlike = async (postId, userId) => {
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        const likeExist = await client.query(
            `SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,
            [postId, userId]
        );
        if(likeExist.rows.length > 0){
            await client.query(
                `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
                [postId, userId]
            );
            await client.query(
                `DELETE FROM notifications WHERE post_id = $1 AND sender_id = $2 AND type = 'like'`,
                [postId, userId]
            );
            await client.query('COMMIT');

            return { message: 'Post unliked successfully' };

        } else {
            await client.query(
                `INSERT INTO likes (post_id, user_id) VALUES ($1, $2)`,
                [postId, userId]
            );
            //finding post owner id
            const post = await client.query(
                    `SELECT user_id FROM posts WHERE id = $1`,
                    [postId]
                );
                //creating notification for post owner
            const recepientId = post.rows[0].user_id;
            // Avoid sending notification to self
            if(recepientId !== userId){
                await client.query(
                    `INSERT INTO notifications (recipient_id, sender_id, post_id, type) VALUES ($1, $2, $3, 'like')`,
                    [recepientId, userId, postId]
                );
            }
            await client.query('COMMIT');
            return { message: 'Post liked successfully' };
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in like/unlike operation:', error);
        throw new AppError('Error occurred while processing like/unlike operation', 500);
    } finally {
        client.release();// Ensure the client is released back to the pool
    }
};

const getLikesCount = async(postId) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(*) FROM likes WHERE post_id = $1`,
            [postId]
        );
        return parseInt(result.rows[0].count, 10);
    } catch (error) {
        throw new AppError('Error occurred while fetching likes count', 500);

    }
};

module.exports = {
    createLikeUnlike,
    getLikesCount
}