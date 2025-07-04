import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock logger to avoid console output during tests
jest.mock('../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}));

// Simple test to avoid "no tests" error
describe('Test Setup', () => {
    it('should load test environment', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });
}); 