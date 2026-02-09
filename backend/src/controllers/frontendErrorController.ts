import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import FrontendError from "../models/frontendErrorModel";
import User from "../models/userModel";
import { sendFrontendErrorNotification } from "../services/emailService";

// Log frontend error
export const logFrontendError = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const {
        errorMessage,
        errorStack,
        errorType,
        url,
        userAgent,
        metadata,
      } = req.body;

      if (!errorMessage || !errorType || !url) {
        res.status(400).json({ message: "Missing required fields." });
        return;
      }

      // Get user info if authenticated
      let userId: string | undefined;
      let userEmail: string | undefined;

      if (req.userId) {
        const user = await User.findById(req.userId).select("email").lean();
        userId = req.userId;
        userEmail = user?.email;
      }

      const userAgentVal = userAgent || req.headers["user-agent"] || "Unknown";
      const error = await FrontendError.create({
        userId,
        userEmail,
        errorMessage,
        errorStack,
        errorType,
        url,
        userAgent: userAgentVal,
        metadata: metadata || {},
        timestamp: new Date(),
      });

      sendFrontendErrorNotification({
        errorMessage,
        errorStack,
        errorType,
        url,
        userAgent: userAgentVal,
        userEmail,
        errorId: error._id?.toString(),
        metadata: metadata || {},
      }).catch((err) =>
        console.error("Frontend error email failed:", err)
      );

      res.status(200).json({
        message: "Error logged successfully.",
        errorId: error._id,
      });
    } catch (error: any) {
      console.log("Error logging frontend error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all frontend errors
export const getFrontendErrors = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }

    try {
      const user = await User.findById(req.userId).select("role").lean();
      if (user?.role !== "admin") {
        res.status(403).json({ message: "Not an admin." });
        return;
      }

      const { resolved, limit = 100, page = 1 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const query: any = {};
      if (resolved !== undefined) {
        query.resolved = resolved === "true";
      }

      const [errors, total] = await Promise.all([
        FrontendError.find(query)
          .sort({ timestamp: -1 })
          .limit(Number(limit))
          .skip(skip)
          .lean(),
        FrontendError.countDocuments(query),
      ]);

      res.status(200).json({
        status: 200,
        message: "Errors found.",
        errors,
        total,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Mark error as resolved
export const resolveFrontendError = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }

    try {
      const user = await User.findById(req.userId).select("role").lean();
      if (user?.role !== "admin") {
        res.status(403).json({ message: "Not an admin." });
        return;
      }

      const { errorId } = req.params;
      const { resolved = true } = req.body;

      const error = await FrontendError.findByIdAndUpdate(
        errorId,
        {
          resolved,
          resolvedAt: resolved ? new Date() : undefined,
          resolvedBy: resolved ? req.userId : undefined,
        },
        { new: true }
      ).lean();

      if (!error) {
        res.status(404).json({ message: "Error not found." });
        return;
      }

      res.status(200).json({
        message: `Error ${resolved ? "resolved" : "unresolved"} successfully.`,
        error,
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete frontend error
export const deleteFrontendError = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }

    try {
      const user = await User.findById(req.userId).select("role").lean();
      if (user?.role !== "admin") {
        res.status(403).json({ message: "Not an admin." });
        return;
      }

      const { errorId } = req.params;

      const error = await FrontendError.findByIdAndDelete(errorId).lean();

      if (!error) {
        res.status(404).json({ message: "Error not found." });
        return;
      }

      res.status(200).json({
        message: "Error deleted successfully.",
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get error statistics
export const getErrorStats = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }

    try {
      const user = await User.findById(req.userId).select("role").lean();
      if (user?.role !== "admin") {
        res.status(403).json({ message: "Not an admin." });
        return;
      }

      const [total, unresolved, byType, recent] = await Promise.all([
        FrontendError.countDocuments(),
        FrontendError.countDocuments({ resolved: false }),
        FrontendError.aggregate([
          {
            $group: {
              _id: "$errorType",
              count: { $sum: 1 },
            },
          },
        ]),
        FrontendError.countDocuments({
          timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }),
      ]);

      res.status(200).json({
        status: 200,
        message: "Stats found.",
        stats: {
          total,
          unresolved,
          resolved: total - unresolved,
          byType: byType.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {} as Record<string, number>),
          last24Hours: recent,
        },
      });
    } catch (error: any) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
);

