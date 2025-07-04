import * as userService from '../services/userService';
import * as authService from '../services/authService';
import catchErrors from '../utils/catchErrors';
export const register = catchErrors(async (req, res) => {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json({ success: true, data: user });
});
export const login = catchErrors(async (req, res) => {
    const userData = req.body;
    const user = await userService.authenticateUser(userData.username, userData.password);
    const token = authService.generateToken(authService.createAuthPayload(user));
    res.json({ success: true, data: { token } });
});
export const getProfile = catchErrors(async (req, res) => {
    const authenticatedReq = req;
    res.json({ success: true, data: authenticatedReq.user });
});
