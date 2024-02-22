import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { User } from '../models/userSchema.js';
import { sendToken} from '../utils/jwtToken.js';

export const register = catchAsyncError(async (req, res, next) => {

    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !phone || !role || !password) {
        return next(new ErrorHandler("Please provide required details"));
    }
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandler("User already exists"));
    }
    const user = await User.create({
        name,
        email,
        phone,
        role, 
        password,
    });
    sendToken(user, 200, "User registered successfully!", res);
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(new ErrorHandler("Please provide email ,password or role", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    if (user.role != role) {
        return next(new ErrorHandler("User with this role not found", 400));
    }
    sendToken(user, 200, "User logged in successfully!", res);
});