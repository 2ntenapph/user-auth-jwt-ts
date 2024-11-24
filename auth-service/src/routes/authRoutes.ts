import { Router } from "express";
import { signup, login, logout } from "../controllers/authController";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";


const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
