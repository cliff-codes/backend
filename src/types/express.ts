import { Request } from 'express';
import { UserSafe } from '../services/userService';
import { AuthPayload } from '../services/authService';

export interface AuthenticatedRequest extends Request {
    user: UserSafe;
    token: AuthPayload;
}

export interface TypedRequestBody<T> extends Request {
    body: T;
}

export interface TypedResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Array<{ field: string; message: string }>;
} 