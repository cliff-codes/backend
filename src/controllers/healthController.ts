import { Request, Response } from 'express';
import catchErrors from '../utils/catchErrors';
import { TypedResponse } from '../types/express';

export const healthCheck = catchErrors(async (_req: Request, res: Response<TypedResponse<{ message: string }>>) => {
    res.json({ success: true, data: { message: 'API is healthy' } });
});
