import { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Video from "../../models/videoModel";
import User from "../../models/userModel";
import Card from "../../models/cardModel";
import { CustomRequest } from "../../middleware/authMiddleware";

export const deleteVideo = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const videoId = req.header("x-video-id");
    if (!videoId) {
      res.status(400).json({ message: "No videoId provided." });
      return;
    }

    if (!req.userId) {
      res.status(400).json({ message: "No userId provided." });
      return;
    }

    try {
      const deleteVideo = await Video.findOne({
        _id: videoId,
        userId: req.userId,
      });
      if (deleteVideo) {
        await Video.deleteOne({ _id: videoId, userId: req.userId });

        const deletedCards = await Card.deleteMany({
          videoId,
          userId: req.userId,
        });

        await User.findByIdAndUpdate(req.userId, {
          $inc: {
            totalVideos: -1,
            totalCards: -deletedCards.deletedCount,
          },
        });

        res.status(200).json({ message: "Video and related cards deleted." });
      } else {
        res.status(404).json({ message: "Video not found." });
      }
      return;
    } catch (error: any) {
      console.error("deleteVideo error:", error);
      res.status(500).json({ message: error.message });
      return;
    }
  }
);
