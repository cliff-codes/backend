import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import config from '../config/index';
import logger from '../utils/logger';
import { AuthenticationError } from '../utils/errors';
import { UserSafe } from './userService';

export interface AuthPayload {
    userId: string;
    username: string;
    iat: number;
}

const signOptions: SignOptions = {
    expiresIn: config.jwt.expiresIn as any,
    issuer: 'jwt-auth-api',
    audience: 'jwt-auth-api-users' as string,
};

const verifyOptions: VerifyOptions = {
    issuer: 'jwt-auth-api',
    audience: 'jwt-auth-api-users' as string,
};

export const generateToken = (payload: AuthPayload): string => {
    try {
        const token = jwt.sign(payload, config.jwt.secret as string, signOptions);
        logger.debug('JWT token generated', { userId: payload.userId });
        return token;
    } catch (error: any) {
        logger.error('Failed to generate JWT token', { error: error.message });
        throw new AuthenticationError('Failed to generate authentication token');
    }
};

export const verifyToken = (token: string): AuthPayload => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret as string, verifyOptions);
        logger.debug('JWT token verified', { userId: (decoded as any).userId });
        return decoded as AuthPayload;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            logger.warn('JWT token expired', { token: token.substring(0, 20) + '...' });
            throw new AuthenticationError('Token has expired');
        }
        if (error.name === 'JsonWebTokenError') {
            logger.warn('Invalid JWT token', { token: token.substring(0, 20) + '...' });
            throw new AuthenticationError('Invalid token');
        }
        logger.error('JWT token verification failed', { error: error.message });
        throw new AuthenticationError('Token verification failed');
    }
};

export const extractTokenFromHeader = (authHeader?: string): string => {
    if (!authHeader || typeof authHeader !== 'string') {
        throw new AuthenticationError('Authorization header is required');
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new AuthenticationError('Authorization header must be in format: Bearer <token>');
    }
    return parts[1];
};

export const createAuthPayload = (user: UserSafe): AuthPayload => {
    return {
        userId: user.id,
        username: user.username,
        iat: Math.floor(Date.now() / 1000),
    };
};
