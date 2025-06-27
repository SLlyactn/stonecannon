const db = require('../../database.js');  // SQLite 数据库连接
const authenticateToken = require('../../middleware/authenticateToken'); // 引入JWT身份验证中间件

module.exports = function(app) {
    // 保存草稿
    app.post('/posts', authenticateToken, (req, res) => {
        const { text } = req.body;
        const author_id = req.user.user_id;  // 从 token 中获取 user_id

        if (!text) {
            return res.status(400).json({ error_message: 'Text is required' });
        }

        // 去掉时间，只插入文本和作者ID
        const sql = 'INSERT INTO posts (text, author_id) VALUES (?, ?)';
        const params = [text, author_id];

        db.run(sql, params, function (err) {
            if (err) {
                console.log(err);  // 打印错误信息
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            res.status(201).json({ post_id: this.lastID, message: 'Post created successfully!' });
        });
    });

/// 发布帖子
    app.post('/posts/publish', authenticateToken, (req, res) => {
        const { text } = req.body;
        const author_id = req.user.user_id;  // 从 token 中获取 user_id

        if (!text) {
            return res.status(400).json({ error_message: 'Text is required' });
        }

        const date_published = Date.now();  // 获取当前时间戳

        // 插入文本、作者ID和发布时间
        const sql = 'INSERT INTO posts (text, author_id, date_published,status) VALUES (?, ?, ?,1)';
        const params = [text, author_id, date_published];

        db.run(sql, params, function (err) {
            if (err) {
                console.log(err);  // 打印错误信息
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            res.status(201).json({ post_id: this.lastID, message: 'Post created successfully!' });
        });
    });



    // 获取单个帖子
    app.get('/posts/:post_id', (req, res) => {
        const { post_id } = req.params;
        const sql = 'SELECT * FROM posts WHERE post_id = ?';
        db.get(sql, [post_id], (err, post) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            if (!post) {
                return res.status(404).json({ error_message: 'Post not found' });
            }
            res.json(post);
        });
    });

    // 删除帖子
    app.delete('/posts/:post_id', authenticateToken, (req, res) => {
        const { post_id } = req.params;
        const author_id = req.user.user_id;  // 获取当前用户的 user_id

        const sql = 'DELETE FROM posts WHERE post_id = ? AND author_id = ?';
        db.run(sql, [post_id, author_id], function (err) {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            if (this.changes === 0) {
                return res.status(403).json({ error_message: 'You can only delete your own posts' });
            }
            res.json({ message: 'Post deleted successfully!' });
        });
    });

    // 更新帖子
    app.patch('/posts/:post_id', authenticateToken, (req, res) => {
        const { post_id } = req.params;
        const { text } = req.body;
        const author_id = req.user.user_id;  // 获取当前用户的 user_id

        if (!text) {
            return res.status(400).json({ error_message: 'Text is required' });
        }
        const sql = 'UPDATE posts SET text = ? WHERE post_id = ? AND author_id = ?';
        db.run(sql, [text, post_id, author_id], function (err) {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            if (this.changes === 0) {
                return res.status(403).json({ error_message: 'You can only update your own posts' });
            }
            res.json({ message: 'Post updated successfully!' });
        });
    });

    // 点赞帖子
    app.post('/posts/:post_id/like', authenticateToken, (req, res) => {
        const { post_id } = req.params;
        const user_id = req.user.user_id;

        // 检查是否已经点赞
        const checkLikeSql = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';
        db.get(checkLikeSql, [post_id, user_id], (err, like) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            if (like) {
                return res.status(403).json({ error_message: 'You have already liked this post' });
            }

            // 点赞
            const likeSql = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
            db.run(likeSql, [post_id, user_id], function (err) {
                if (err) {
                    return res.status(500).json({ error_message: 'Internal server error' });
                }
                res.json({ message: 'Post liked successfully!' });
            });
        });
    });

    // 取消点赞帖子
    app.delete('/posts/:post_id/like', authenticateToken, (req, res) => {
        const { post_id } = req.params;
        const user_id = req.user.user_id;

        const sql = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
        db.run(sql, [post_id, user_id], function (err) {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            if (this.changes === 0) {
                return res.status(403).json({ error_message: 'You have not liked this post' });
            }
            res.json({ message: 'Post unliked successfully!' });
        });
    });

    // 根据用户ID获取该用户所有帖子，支持分页，已发布
    app.get('/users/:user_id/posts', (req, res) => {
        const { user_id } = req.params;
        const pageNum = parseInt(req.query.pageNum) || 1;  // 获取分页参数，默认为1
        const pageSize = parseInt(req.query.pageSize) || 10;  // 每页记录数，默认为10
        const offset = (pageNum - 1) * pageSize;  // 计算偏移量

        // 查询用户的帖子
        const sql = 'SELECT * FROM posts WHERE author_id = ?  AND status = 1 LIMIT ? OFFSET ?';
        const countSql = 'SELECT COUNT(*) AS total FROM posts WHERE author_id = ? AND status = 1';  // 统计总记录数
        // 先执行总数查询
        db.get(countSql, [user_id], (err, row) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }

            const total = row.total;

            // 再执行分页查询
            db.all(sql, [user_id, pageSize, offset], (err, posts) => {
                if (err) {
                    return res.status(500).json({ error_message: 'Internal server error' });
                }
                if (posts.length === 0) {
                    return res.status(404).json({ error_message: 'No posts found for this user' });
                }

                // 返回分页结果和总记录数
                res.json({
                    total,  // 总记录数
                    pageNum,
                    pageSize,
                    records: posts  // 当前页的帖子
                });
            });
        });
    });
    //未发布
    app.get('/users/:user_id/posts/draft', (req, res) => {
        const { user_id } = req.params;
        const pageNum = parseInt(req.query.pageNum) || 1;  // 获取分页参数，默认为1
        const pageSize = parseInt(req.query.pageSize) || 10;  // 每页记录数，默认为10
        const offset = (pageNum - 1) * pageSize;  // 计算偏移量

        // 查询用户的帖子
        const sql = 'SELECT * FROM posts WHERE author_id = ?  AND status = 0 LIMIT ? OFFSET ?';
        const countSql = 'SELECT COUNT(*) AS total FROM posts WHERE author_id = ? AND status = 0';  // 统计总记录数
        // 先执行总数查询
        db.get(countSql, [user_id], (err, row) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }

            const total = row.total;

            // 再执行分页查询
            db.all(sql, [user_id, pageSize, offset], (err, posts) => {
                if (err) {
                    return res.status(500).json({ error_message: 'Internal server error' });
                }
                if (posts.length === 0) {
                    return res.status(404).json({ error_message: 'No posts found for this user' });
                }

                // 返回分页结果和总记录数
                res.json({
                    total,  // 总记录数
                    pageNum,
                    pageSize,
                    records: posts  // 当前页的帖子
                });
            });
        });
    });

    // 发布草稿
    app.post('/posts/publish/draft', authenticateToken, (req, res) => {
        const { post_id } = req.body;
        const author_id = req.user.user_id;

        if (!post_id) {
            return res.status(400).json({ error_message: 'Post ID is required' });
        }

        const updateSql = 'UPDATE posts SET date_published = ?, status = 1 WHERE post_id = ? AND author_id = ?';
        const updateParams = [Date.now(), post_id, author_id];

        db.run(updateSql, updateParams, function(err) {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            if (this.changes === 0) {
                return res.status(403).json({ error_message: 'You can only publish your own posts or the post does not exist' });
            }
            res.status(200).json({ message: 'Post published successfully!' });
        });
    });
// 查看所有用户发布的帖子，支持分页、查询条件、点赞统计和用户是否点赞及关注
    app.get('/Allposts', authenticateToken, (req, res) => {
        const { pageNum = 1, pageSize = 10, searchText = '' } = req.query;
        const user_id = req.user.user_id;  // 当前登录用户的ID
        const offset = (pageNum - 1) * pageSize;

        // 查询总帖子数
        const countSql = `
            SELECT COUNT(*) as total
            FROM posts
                     JOIN users ON posts.author_id = users.user_id
            WHERE (posts.text LIKE ? OR users.first_name LIKE ? OR users.last_name LIKE ?)
              AND posts.status = 1
        `;

        const searchParam = `%${searchText}%`;

        // 查询帖子信息并统计每个帖子的点赞数、当前用户是否已点赞以及是否已关注作者
        const postsSql = `
    SELECT posts.post_id, posts.text, posts.date_published, posts.author_id,
           users.first_name, users.last_name,
           (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.post_id) as like_count,
           (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.post_id AND likes.user_id = ?) as liked,
           (SELECT COUNT(*) FROM followers WHERE followers.user_id = posts.author_id AND followers.follower_id = ?) as followed
    FROM posts
    JOIN users ON posts.author_id = users.user_id
    WHERE (posts.text LIKE ? OR users.first_name LIKE ? OR users.last_name LIKE ?)
    AND posts.status = 1
    ORDER BY posts.date_published DESC
    LIMIT ? OFFSET ?
    `;

        // 先查询总数，再查询分页数据
        db.get(countSql, [searchParam, searchParam, searchParam], (err, countResult) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }

            const total = countResult.total;

            db.all(postsSql, [user_id, user_id, searchParam, searchParam, searchParam, parseInt(pageSize), offset], (err, posts) => {
                if (err) {
                    return res.status(500).json({ error_message: 'Internal server error' });
                }

                res.json({
                    total,
                    records: posts
                });
            });
        });
    });



};
