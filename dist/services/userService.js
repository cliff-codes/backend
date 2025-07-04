import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index';
import logger from '../utils/logger';
import { ConflictError, NotFoundError } from '../utils/errors';
const ensureDataDirectory = async () => {
    const dataDir = path.dirname(config.data.usersFile);
    try {
        await fs.access(dataDir);
    }
    catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
};
const readUsersFile = async () => {
    try {
        await ensureDataDirectory();
        const data = await fs.readFile(config.data.usersFile, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};
const writeUsersFile = async (users) => {
    await ensureDataDirectory();
    await fs.writeFile(config.data.usersFile, JSON.stringify(users, null, 2));
};
const hashPassword = async (password) => {
    return bcrypt.hash(password, config.security.bcryptRounds);
};
const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
export const findUserByUsername = async (username) => {
    const users = await readUsersFile();
    return users.find(user => user.username === username.toLowerCase());
};
const findUserById = async (userId) => {
    const users = await readUsersFile();
    return users.find(user => user.id === userId);
};
export const createUser = async (userData) => {
    const existingUser = await findUserByUsername(userData.username);
    if (existingUser) {
        throw new ConflictError('Username already exists');
    }
    const hashedPassword = await hashPassword(userData.password);
    const newUser = {
        id: uuidv4(),
        username: userData.username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const users = await readUsersFile();
    users.push(newUser);
    await writeUsersFile(users);
    logger.info('User created successfully', { username: newUser.username, userId: newUser.id });
    const { password: passwordField, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};
export const authenticateUser = async (username, password) => {
    const user = await findUserByUsername(username);
    if (!user) {
        throw new NotFoundError('Invalid username or password');
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new NotFoundError('Invalid username or password');
    }
    logger.info('User authenticated successfully', { username: user.username, userId: user.id });
    const { password: passwordField2, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
export const getUserById = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
