import catchErrors from '../utils/catchErrors';
export const healthCheck = catchErrors(async (_req, res) => {
    res.json({ success: true, data: { message: 'API is healthy' } });
});
