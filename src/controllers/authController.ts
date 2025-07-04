import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as authService from '../services/authService';
import catchErrors from '../utils/catchErrors';
import { RegisterInput, LoginInput } from '../schemas/authSchemas';

export const register = catchErrors(async (req: Request, res: Response) => {
    const userData = req.body as RegisterInput;
    const user = await userService.createUser(userData);
    res.status(201).json({ success: true, data: user });
});

export const login = catchErrors(async (req: Request, res: Response) => {
    const userData = req.body as LoginInput;
    const user = await userService.authenticateUser(userData.username, userData.password);
    const token = authService.generateToken(authService.createAuthPayload(user));
    res.json({ success: true, data: { token } });
});

export const getProfile = catchErrors(async (req: Request, res: Response) => {
    const authenticatedReq = req as any;
    res.json({ success: true, data: authenticatedReq.user });
});
