const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kalvium_forge_secret_key';

/**
 * Verifies the JWT token from the Authorization header.
 * Attaches `req.user = { id, full_name }` on success.
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, full_name, iat, exp }
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = verifyToken;
