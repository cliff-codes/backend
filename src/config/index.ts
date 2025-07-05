import dotenv from 'dotenv';

dotenv.config();

const config = {
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
        corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:3001'],
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'VPipi8vNClu72rlUqpmcJsE9er5Rplg7MqB+/SXcv1V2e24lAIIu3Xdz9wkAyM2Jht1RI4WSXp/be2LPtaD0rQ==',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    },
    data: {
        usersFile: process.env.USERS_FILE || './data/users.json',
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
};

export default config;
