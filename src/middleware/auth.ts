import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from '../services/authService.js';
import { getUserById } from '../services/userService.js';
import logger from '../utils/logger.js';
import { AuthenticatedRequest } from '../types/express.js';

export const authenticateToken = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        const decoded = verifyToken(token);
        const user = await getUserById(decoded.userId);
        
        (req as AuthenticatedRequest).user = user;
        (req as AuthenticatedRequest).token = decoded;
        next();
    } catch (error: any) {
        logger.warn('Authentication failed', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            error: error.message,
        });
        next(error);
    }
};
