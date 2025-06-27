const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../database.js');  // SQLite 数据库连接
const authenticateToken = require('../../middleware/authenticateToken');
const secretKey = '2155e6d27891f020c7a42ae7b33e37fe05e5a3ecbc6680f73ba0aa791d26eba8c569e7f7422c3ad9ab5780d89d6a1b338697c721af37dbd0dc2c9bb411d6815a';  // JWT Secret key, 需要确保这个密钥的安全

module.exports = function(app) {
    // 注册用户的路由
    app.post('/users', async (req, res) => {
        const { first_name, last_name, username, password } = req.body;
        try {
            // 验证是否缺少必需的字段
            if (!first_name || !last_name || !username || !password) {
                return res.status(400).json({
                    status: 400,  // 状态码
                    error_message: 'Missing required fields'
                });
            }

            // 检查密码长度是否小于 6 个字符
            if (password.length < 6) {
                return res.status(400).json({
                    status: 400,  // 状态码
                    error_message: 'Password too short'
                });
            }

            // 检查用户名是否符合格式要求（例如，至少 3 个字符）
            if (username.length < 3) {
                return res.status(400).json({
                    status: 400,  // 状态码
                    error_message: 'Username too short'
                });
            }

            // 检查用户名是否包含非法字符
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    status: 400,  // 状态码
                    error_message: 'Username contains invalid characters'
                });
            }

            // 生成盐并对密码进行加密
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const sql = 'INSERT INTO users (first_name, last_name, username, password, salt) VALUES (?, ?, ?, ?, ?)';
            const params = [first_name, last_name, username, hashedPassword, salt];

            db.run(sql, params, function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({
                            status: 400,  // 状态码
                            error_message: 'The username is already taken'
                        });
                    }
                    return res.status(500).json({
                        status: 500,  // 状态码
                        error_message: 'Internal server error'
                    });
                }
                return res.status(201).json({
                    status: 201,  // 状态码
                    message: 'User created successfully',
                    user_id: this.lastID
                });
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,  // 状态码
                error_message: 'Internal server error'
            });
        }
    });



    // 用户登录的路由
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        // 验证请求体中是否包含必需的字段
        if (!username || !password) {
            return res.status(400).json({
                error_message: 'Missing required fields',  // 错误：缺少必填字段
                status: 400,  // 状态码
            });
        }
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], async (err, user) => {
            if (err) {
                return res.status(500).json({
                    status: 500,  // 状态码
                    error_message: 'Internal server error'  // 错误信息
                });

            }
            if (!user) {
                return res.status(400).json({
                    status: 400,  // 状态码
                    error_message: 'User not found'  // 错误：用户不存在
                });

            }

            // 验证密码是否正确
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    status: 400,  // 状态码
                    error_message: 'Invalid password'  // 错误：密码不正确
                });
            }

            // 生成 session token (JWT)
            const sessionToken = jwt.sign(
                { user_id: user.user_id, username: user.username },
                secretKey,
                { expiresIn: '1h' }
            );

            // 将 session token 存储到数据库中
            const updateTokenSql = 'UPDATE users SET session_token = ? WHERE user_id = ?';
            db.run(updateTokenSql, [sessionToken, user.user_id], function (err) {
                if (err) {
                    return res.status(500).json({
                        error_message: 'Internal server error'  // 错误：更新 token 失败
                    });
                }

                // 返回成功的响应，符合 OpenAPI 规范
                return res.status(200).json({
                    message: 'Login successful!',  // 成功消息
                    token: sessionToken,// 返回生成的 JWT token

                    user_id:user.user_id //用户id
                });
            });
        });
    });


    // 获取所有用户的路由（需要 Token 验证）
    app.get('/users', authenticateToken, (req, res) => {
        db.all('SELECT user_id, first_name, last_name, username FROM users', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            res.json({ users: rows });
        });
    });

    // 用户退出登录的路由
    app.post('/logout', authenticateToken, (req, res) => {
        const user_id = req.user.user_id;  // 从已认证的 token 中获取 user_id
        // 清除 session_token
        const sql = 'UPDATE users SET session_token = NULL WHERE user_id = ?';
        db.run(sql, [user_id], function (err) {
            if (err) {
                return res.status(500).json({
                    status: 500,  // 状态码
                    error_message: 'Internal server error',

                });
            }
            return res.status(200).json({
                status: 200,  // 状态码
                error_message: 'Logout successful',
                user_id: this.lastID
            });
        });
    });



    // 获取单个用户的详细信息（需要 Token 验证）
    app.get('/users/:user_id', authenticateToken, (req, res) => {
        const { user_id } = req.params;

        const sql = 'SELECT user_id, first_name, last_name, username FROM users WHERE user_id = ?';
        db.get(sql, [user_id], (err, row) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            if (!row) {
                return res.status(404).json({ error_message: 'User not found' });
            }
            res.json(row);
        });
    });

// 关注用户
    app.post('/users/:user_id/follow', authenticateToken, (req, res) => {
        const { user_id } = req.params; // 被关注的用户ID
        const follower_id = req.user.user_id; // 当前登录用户的ID

        // 判断不能自己关注自己
        if (user_id == follower_id) {

            return res.status(400).json({
                status: 400,  // 状态码
                error_message: 'You cannot follow yourself.',
            });
        }

        // 检查是否已经关注
        const checkFollowSql = 'SELECT * FROM followers WHERE user_id = ? AND follower_id = ?';
        db.get(checkFollowSql, [user_id, follower_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            if (result) {
                return res.status(403).json({ error_message: 'You are already following this user.' });
            }

            // 插入关注记录
            const followSql = 'INSERT INTO followers (user_id, follower_id) VALUES (?, ?)';
            db.run(followSql, [user_id, follower_id], function(err) {
                if (err) {
                    return res.status(500).json({ error_message: 'Internal server error' });
                }
                res.json({ message: 'User followed successfully!' });
            });
        });
    });

    // 取消关注用户
    app.delete('/users/:user_id/follow', authenticateToken, (req, res) => {
        const { user_id } = req.params; // 被取消关注的用户ID
        const follower_id = req.user.user_id; // 当前登录用户的ID

        const unfollowSql = 'DELETE FROM followers WHERE user_id = ? AND follower_id = ?';
        db.run(unfollowSql, [user_id, follower_id], function(err) {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            if (this.changes === 0) {
                return res.status(403).json({ error_message: 'You are not following this user.' });
            }
            res.json({ message: 'User unfollowed successfully!' });
        });
    });



    // 获取关注列表
    app.get('/users/:user_id/following', authenticateToken, (req, res) => {
        const { user_id } = req.params;
        const sql = `
    SELECT u.username, u.first_name, u.last_name,u.user_id 
    FROM followers f 
    JOIN users u ON f.user_id = u.user_id 
    WHERE f.follower_id = ?
  `;
        db.all(sql, [user_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            res.json(rows);
        });
    });

// 获取粉丝列表
    app.get('/users/:user_id/followers', authenticateToken, (req, res) => {
        const { user_id } = req.params;
        const sql = `
    SELECT u.username, u.first_name, u.last_name,u.user_id
    FROM followers f 
    JOIN users u ON f.follower_id = u.user_id 
    WHERE f.user_id = ?
  `;
        db.all(sql, [user_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error_message: 'Internal server error' });
            }
            res.json(rows);
        });
    });
// 搜索接口
    app.get('/search', (req, res) => {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error_message: 'Missing search query' });
        }

        // 过滤数据，返回包含查询字符串的数据
        const results = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

        // 如果没有找到匹配的结果，返回一个空数组
        if (results.length === 0) {
            return res.status(404).json([]); // 返回一个空数组
        }

        return res.status(200).json(results);
    });

};
