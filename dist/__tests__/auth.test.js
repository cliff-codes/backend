import request from 'supertest';
import app from '../server.js';
import { createUser, findUserByUsername } from '../services/userService.js';
describe('Auth Endpoints', () => {
    const testUser = {
        username: 'testuser',
        password: 'testpass123',
    };
    beforeEach(async () => {
        // Clean up test user if exists
        const existingUser = await findUserByUsername(testUser.username);
        if (existingUser) {
            // In a real app, you'd have a delete method
            // For now, we'll just skip if user exists
        }
    });
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('username', testUser.username);
            expect(response.body.data).not.toHaveProperty('password');
        });
        it('should return 400 for invalid input', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ username: 'ab', password: '123' })
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });
    });
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user for login tests
            await createUser(testUser);
        });
        it('should login successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send(testUser)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
        });
        it('should return 404 for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ username: testUser.username, password: 'wrongpass' })
                .expect(404);
            expect(response.body.success).toBe(false);
        });
    });
});
