import { agent as request } from 'supertest';
import app from '../server';
import { createUser } from '../services/userService';

describe('Auth Endpoints', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const testUser = {
                username: `testuser_${Date.now()}`,
                password: 'testpass123',
            };

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
        it('should login successfully with valid credentials', async () => {
            const testUser = {
                username: `logintest_${Date.now()}`,
                password: 'testpass123',
            };
            
            // Create user first
            await createUser(testUser);

            const response = await request(app)
                .post('/api/auth/login')
                .send(testUser)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
        });

        it('should return 404 for invalid credentials', async () => {
            const testUser = {
                username: `invalidtest_${Date.now()}`,
                password: 'testpass123',
            };
            
            // Create user first
            await createUser(testUser);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ username: testUser.username, password: 'wrongpass' })
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });
}); 