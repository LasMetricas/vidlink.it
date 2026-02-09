import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

export interface CustomRequest extends Request {
  userId?: string;
}

const authMiddleware = expressAsyncHandler(
  async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token is invalid or has expired!" });
    }
  }
);

export default authMiddleware;
