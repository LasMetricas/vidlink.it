import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "./authMiddleware";

// Optional auth middleware - doesn't fail if no token
const optionalAuthMiddleware = expressAsyncHandler(
  async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          userId: string;
        };
        req.userId = decoded.userId;
      } catch (error) {
        // Invalid token, continue without userId
        req.userId = undefined;
      }
    }
    
    next();
  }
);

export default optionalAuthMiddleware;

