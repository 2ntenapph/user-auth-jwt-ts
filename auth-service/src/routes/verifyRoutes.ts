import { Router } from "express";
import { verifyEmail } from "../controllers/verifyController";

const router = Router();

router.post("/email", verifyEmail);

export default router;
