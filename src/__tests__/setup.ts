import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Create a unique test data directory for each test run
const testDataDir = path.join(__dirname, '../../data/test');
const testUsersFile = path.join(testDataDir, 'users.json');

// Mock logger to avoid console output during tests
jest.mock('../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}));

// Mock the config to use test data files
jest.mock('../config/index', () => ({
    server: {
        port: parseInt(process.env.PORT || '3001', 10),
        nodeEnv: 'test',
        corsOrigin: ['http://localhost:3000', 'http://localhost:3001'],
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'test-secret-key',
        expiresIn: '1h',
    },
    security: {
        bcryptRounds: 10,
    },
    data: {
        usersFile: testUsersFile,
    },
    rateLimit: {
        windowMs: 900000,
        maxRequests: 100,
    },
}));

//teardown for test data
beforeAll(async () => {
    // Ensure test data directory exists
    await fs.mkdir(testDataDir, { recursive: true });
    // Initialize empty users file
    await fs.writeFile(testUsersFile, '[]');
});

afterAll(async () => {
    // Clean up test data
    try {
        await fs.rm(testDataDir, { recursive: true, force: true });
    } catch (error) {
        // Ignore cleanup errors
    }
});

// Simple test to avoid "no tests" error
describe('Test Setup', () => {
    it('should load test environment', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });
}); 