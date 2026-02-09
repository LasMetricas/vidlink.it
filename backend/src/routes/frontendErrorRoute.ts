import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware";
import {
  logFrontendError,
  getFrontendErrors,
  resolveFrontendError,
  deleteFrontendError,
  getErrorStats,
} from "../controllers/frontendErrorController";

const frontendErrorRoutes = express.Router();

// Public endpoint - anyone can log errors (includes user info if authenticated)
frontendErrorRoutes.route("/log").post(optionalAuthMiddleware, logFrontendError);

// Admin endpoints
frontendErrorRoutes.route("/get").get(authMiddleware, getFrontendErrors);
frontendErrorRoutes.route("/stats").get(authMiddleware, getErrorStats);
frontendErrorRoutes.route("/resolve/:errorId").put(authMiddleware, resolveFrontendError);
frontendErrorRoutes.route("/delete/:errorId").delete(authMiddleware, deleteFrontendError);

export default frontendErrorRoutes;

