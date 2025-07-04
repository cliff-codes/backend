import { NextFunction, Request, Response } from 'express';

type AsyncController<T = Request> = (req: T, res: Response, next: NextFunction) => Promise<any>;

const catchErrors = <T = Request>(controller: AsyncController<T>): AsyncController<T> => {
    return async (req: T, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default catchErrors;
