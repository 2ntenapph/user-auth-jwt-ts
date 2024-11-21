"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = __importDefault(require("./models/user"));
const db_1 = __importDefault(require("./models/db"));
const sendOtp_1 = require("./sendOtp");
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// Sync the database
db_1.default.sync();
// Route to handle user sign-up
app.post('/api/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    const existingUser = yield user_1.default.findOne({ where: { email } });
    if (existingUser) {
        res.status(400).json({ message: 'Email is already in use' });
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    yield user_1.default.create({
        email,
        password: hashedPassword,
        role,
        isVerified: false, // Default to false
    });
    yield (0, sendOtp_1.sendOtp)(email);
    res.status(201).json({ message: 'User created successfully. Please verify your email.' });
}));
// Route for OTP email verification
app.post('/api/verify-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, otp } = req.body;
    const user = yield user_1.default.findOne({ where: { email } });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    if (user.otp !== otp || Date.now() > ((_b = (_a = user.otpExpiration) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : 0)) {
        res.status(400).json({ message: 'Invalid or expired OTP' });
        return;
    }
    user.isVerified = true;
    user.role = 'verified_user';
    user.otp = null;
    user.otpExpiration = null;
    yield user.save();
    const token = jsonwebtoken_1.default.sign({ email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Email verified successfully', token });
}));
// Route for login
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ where: { email } });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    if (!user.isVerified) {
        res.status(403).json({ message: 'Please verify your email first' });
        return;
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: 'Invalid password' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
}));
// Protected route to get user info
app.get('/api/user-info', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Access the user email from the JWT token stored in req.user
    const email = req.user.email;
    // Fetch the user from the database using the email
    const user = yield user_1.default.findOne({ where: { email } });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    if (!user.isVerified) {
        res.status(403).json({ message: 'Please verify your email first' });
        return;
    }
    // Respond with the user information if everything is valid
    res.status(200).json({
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });
}));
// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
