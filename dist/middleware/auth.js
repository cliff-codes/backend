import { extractTokenFromHeader, verifyToken } from '../services/authService.js';
import { getUserById } from '../services/userService.js';
import logger from '../utils/logger.js';
export const authenticateToken = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        const decoded = verifyToken(token);
        const user = await getUserById(decoded.userId);
        req.user = user;
        req.token = decoded;
        next();
    }
    catch (error) {
        logger.warn('Authentication failed', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            error: error.message,
        });
        next(error);
    }
};
