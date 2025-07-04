import * as swaggerJsdocNS from 'swagger-jsdoc';
import * as swaggerUiNS from 'swagger-ui-express';
import config from '../config/index';
const swaggerJsdoc = swaggerJsdocNS.default || swaggerJsdocNS;
const swaggerUi = swaggerUiNS.default || swaggerUiNS;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JWT Authentication API',
            version: '1.0.0',
            description: 'A secure REST API with JWT authentication',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.server.port}/api`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer <token>',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique user identifier',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        username: {
                            type: 'string',
                            description: 'User username',
                            example: 'john_doe',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'User creation timestamp',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'User last update timestamp',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                    },
                    required: ['id', 'username', 'createdAt', 'updatedAt'],
                },
                RegisterRequest: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Username (3-30 characters, alphanumeric + underscore)',
                            example: 'john_doe',
                            minLength: 3,
                            maxLength: 30,
                        },
                        password: {
                            type: 'string',
                            description: 'Password (6-100 characters, must contain letter + number)',
                            example: 'password123',
                            minLength: 6,
                            maxLength: 100,
                        },
                    },
                    required: ['username', 'password'],
                },
                LoginRequest: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Username',
                            example: 'john_doe',
                        },
                        password: {
                            type: 'string',
                            description: 'Password',
                            example: 'password123',
                        },
                    },
                    required: ['username', 'password'],
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        token: {
                            type: 'string',
                            description: 'JWT token for authentication',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                    required: ['success', 'token'],
                },
                UserResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                    required: ['success', 'user'],
                },
                HealthResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'API is healthy',
                        },
                    },
                    required: ['success', 'message'],
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            description: 'Error message',
                            example: 'Validation failed',
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        example: 'username',
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Username is required',
                                    },
                                },
                            },
                        },
                    },
                    required: ['success', 'message'],
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/docs/*.yaml', './src/routes/*.ts', './src/controllers/*.ts'],
};
const specs = swaggerJsdoc(options);
export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'JWT Auth API Documentation',
        customfavIcon: '/favicon.ico',
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true,
            deepLinking: true,
        },
    }));
};
