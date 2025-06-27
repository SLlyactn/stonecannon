const jwt = require('jsonwebtoken');
const secretKey = '2155e6d27891f020c7a42ae7b33e37fe05e5a3ecbc6680f73ba0aa791d26eba8c569e7f7422c3ad9ab5780d89d6a1b338697c721af37dbd0dc2c9bb411d6815a';  // JWT Secret key, 需要确保这个密钥的安全


function authenticateToken(req, res, next) {
    // 从请求头中获取 Authorization 字段
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // 提取 token，格式通常是 "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error_message: 'Access denied. No token provided.' });
    }

    // 验证 token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error_message: 'Invalid or expired token.' });
        }

        // 将解码后的用户信息附加到请求对象上
        req.user = user;
        next();  // 调用 next() 继续处理后续请求
    });
}

module.exports = authenticateToken;
