import { Router } from "express";
import { refreshTokens, revokeAllTokens, validateToken } from "../controllers/tokenController";

const router = Router();


// Refresh Tokens Endpoint
router.post("/validate-token", validateToken);

// Refresh Tokens Endpoint
router.post("/refresh", refreshTokens);

// Revoke All Tokens Endpoint (optional, for security purposes)
router.post("/revoke", revokeAllTokens);

export default router;
