import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { setupSwagger } from './docs/swagger.js';
import { apiLimiter } from './middleware/rateLimit.js';
import logger from './utils/logger.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: config.server.corsOrigin || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));



// Rate limiting
app.use('/api', apiLimiter);

// Logging middleware
app.use(morgan('combined', {
    stream: {
        write: (message: string) => logger.info(message.trim()),
    },
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', routes);

// Swagger documentation
setupSwagger(app);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const PORT = config.server.port;

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        logger.info(`Environment: ${config.server.nodeEnv}`);
        logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
}

export default app;
