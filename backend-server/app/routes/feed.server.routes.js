const db = require('../../database.js');  // SQLite 数据库连接
const authenticateToken = require('../../middleware/authenticateToken'); // 引入JWT身份验证中间件

module.exports = function(app) {
    app.get('/feed',  (req, res) => {
        const { pageNum = 1, pageSize = 10 } = req.query;
        const offset = (pageNum - 1) * pageSize;

        // 查询动态：包括帖子发布、点赞和关注事件，按时间倒序排列
        const feedSql = `
            SELECT 'post' AS type, posts.post_id, posts.text, posts.date_published,
                   users.first_name, users.last_name, NULL AS target_name
            FROM posts
                     JOIN users ON posts.author_id = users.user_id
            WHERE posts.status = 1  -- 只查询已发布的帖子
            UNION ALL
            SELECT 'like' AS type, posts.post_id, posts.text, posts.date_published,
                   u1.first_name, u1.last_name, NULL AS target_name
            FROM likes
                     JOIN posts ON likes.post_id = posts.post_id
                     JOIN users u1 ON likes.user_id = u1.user_id
            WHERE posts.status = 1  -- 只查询已发布的帖子的点赞
            UNION ALL
            SELECT 'follow' AS type, NULL AS post_id, NULL AS text, NULL AS date_published,
                   u1.first_name, u1.last_name, u2.first_name || ' ' || u2.last_name AS target_name
            FROM followers
                     JOIN users u1 ON followers.follower_id = u1.user_id
                     JOIN users u2 ON followers.user_id = u2.user_id
            ORDER BY date_published DESC
                LIMIT ? OFFSET ?
        `;


        // 执行查询并返回结果
        db.all(feedSql, [parseInt(pageSize), offset], (err, feed) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error_message: 'Internal server error' });
            }

            res.json({
                total: feed.length,
                records: feed
            });
        });
    });
}
