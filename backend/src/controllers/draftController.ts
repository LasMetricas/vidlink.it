import { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../middleware/authMiddleware";
import DraftVideo from "../models/draftVideoModel";
import DraftCard from "../models/draftCardModel";
import Video from "../models/videoModel";

export interface CardType {
  isSaved: boolean;
}

// Publish video and card
export const saveDraft = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided user Id." });
      return;
    }

    const { videoLink, duration, title, info, cards } = req.body;

    let parsedCards: CardType[];
    try {
      parsedCards = typeof cards === "string" ? JSON.parse(cards) : cards;
    } catch (error) {
      res.status(400).json({ message: "Invalid cards data" });
      return;
    }
    try {
      const video = new DraftVideo({
        userId: req.userId,
        videoLink,
        duration: Number(duration),
        title,
        info,
        card: parsedCards.length,
      });

      await video.save();

      await Promise.all(
        parsedCards.map((card: any) =>
          DraftCard.create({
            videoId: video._id,
            userId: req.userId,
            link: card.link,
            name: card.name,
            start: card.start,
            no: card.no,
            title: video.title,
            isSaved: card.isSaved,
          })
        )
      );

      res.status(201).json({ message: "Darft saved" });
      return;
    } catch (error: any) {
      console.error("Error in saveDraft:", error);
      res.status(500).json({
        message:
          error.message || "An error occurred while saving a draft video",
      });
      return;
    }
  }
);

//get draft video
export const getDraft = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided user Id." });
      return;
    }
    const videoId = req.header("x-video-id");
    if (!videoId) {
      res.status(400).json({ message: "No videoId provided." });
      return;
    }
    try {
      const videoInfo = await DraftVideo.findOne({
        _id: videoId,
        userId: req.userId,
      })
        .select("userId title description videoLink duration info")
        .populate("draftCards")
        .lean();
      if (videoInfo) {
        res.status(200).json({ message: "Draft video found.", videoInfo });
      } else {
        res.status(404).json({ message: "Draft video not found." });
      }
    } catch (error: any) {
      console.error("Error in getDraft:", error);
      res.status(500).json({
        message:
          error.message || "An error occurred while getting a draft video",
      });
      return;
    }
  }
);

// Get draft videos
export const getDrafts = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided user Id." });
      return;
    }

    try {
      const draftVideos = await DraftVideo.find({ userId: req.userId })
        .select("userId title videoLink duration info card createdAt")
        .lean();
      const publishedVideos = await Video.find({ userId: req.userId })
        .select("userId title videoLink views duration info card createdAt")
        .lean();

      res
        .status(200)
        .json({ message: "Draft videos found.", draftVideos, publishedVideos });
    } catch (error: any) {
      console.error("Error in getDrafts:", error);
      res.status(500).json({
        message:
          error.message || "An error occurred while getting draft videos",
      });
      return;
    }
  }
);
// Delete draft video
export const deleteDraft = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided user Id." });
      return;
    }
    const videoId = req.header("x-video-id");
    if (!videoId) {
      res.status(400).json({ message: "No videoId provided." });
      return;
    }

    try {
      const deleteVideo = await DraftVideo.findOne({
        _id: videoId,
        userId: req.userId,
      });
      if (deleteVideo) {
        await DraftVideo.deleteOne({ _id: videoId, userId: req.userId });
        await DraftCard.deleteMany({ videoId, userId: req.userId });
        res.status(200).json({ message: "Draft video deleted." });
      } else {
        res.status(404).json({ message: "Video not found." });
      }
    } catch (error: any) {
      console.error("Error in deleteDraft:", error);
      res.status(500).json({
        message:
          error.message || "An error occurred while deleting draft video",
      });
      return;
    }
  }
);
