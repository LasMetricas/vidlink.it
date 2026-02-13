import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../../middleware/authMiddleware";
import { Request, Response } from "express";
import User from "../../models/userModel";
import Video from "../../models/videoModel";
import Card from "../../models/cardModel";

// Add like
export const addLike = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const videoId = req.header("x-video-id");
    if (!videoId) {
      res.status(400).json({ message: "No videoId provided." });
      return;
    }
    if (!req.userId) {
      res.status(400).json({ message: "No videoId userId." });
      return;
    }
    try {
      const videoInfo = await Video.findById(videoId).select("userId").lean();
      if (req.userId === videoInfo?.userId?.toString()) {
        res.status(400).json({ message: "you can't add yourself." });
        return;
      }
      const userData = await User.findById(req.userId)
        .select("likeVideosViewer")
        .lean();
      if (userData?.likeVideosViewer?.some((key) => key.videoId === videoId)) {
        await Promise.all([
          Video.updateOne({ _id: videoId }, { $inc: { likes: -1 } }),
          User.updateOne(
            { _id: videoInfo?.userId },
            {
              $pull: {
                likeVideosCreator: { userId: req.userId, videoId },
              },
            }
          ),
          User.updateOne(
            { _id: req.userId },
            { $pull: { likeVideosViewer: { videoId } } }
          ),
        ]);
        res.status(200).json({ message: "Like removed.", like: false });
      } else {
        await Promise.all([
          Video.updateOne({ _id: videoId }, { $inc: { likes: 1 } }),
          User.updateOne(
            { _id: videoInfo?.userId },
            {
              $addToSet: {
                likeVideosCreator: {
                  time: new Date(),
                  videoId,
                  userId: req.userId,
                },
              },
            }
          ),
          User.updateOne(
            { _id: req.userId },
            { $addToSet: { likeVideosViewer: { time: new Date(), videoId } } }
          ),
        ]);
        res.status(200).json({ message: "Like added.", like: true });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Follow user
export const followUser = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const targetUserId = req.header("x-user-id");
    const currentUserId = req.userId;
    if (!targetUserId) {
      res.status(400).json({ message: "No userId provided." });
      return;
    }
    if (!req.userId) {
      res.status(400).json({ message: "Not found current user id" });
      return;
    }
    if (targetUserId === currentUserId) {
      res.status(400).json({ message: "you can't follow yourself." });
      return;
    }
    try {
      const userData = await User.findById(targetUserId).select("followers");
      const follower = userData?.followers?.find(
        (follower) => follower.userId === req.userId
      );
      if (follower) {
        await User.updateOne(
          { _id: targetUserId },
          {
            $set: {
              "followers.$[elem].time": new Date(),
              "followers.$[elem].create": !follower.create,
            },
          },
          {
            runValidators: true,
            arrayFilters: [{ "elem.userId": req.userId }], // Update only the matched follower
          }
        );
        await User.updateOne(
          { _id: currentUserId },
          follower.create
            ? { $pull: { following: targetUserId } }
            : { $addToSet: { following: targetUserId } }
        );
        res.status(200).json({
          message: follower.create
            ? "Unfollowed the user."
            : "Followed the user.",
          followStatus: !follower.create,
        });
      } else {
        // Follow for first time
        await User.updateOne(
          { _id: targetUserId },
          {
            $addToSet: {
              followers: { time: new Date(), create: true, userId: req.userId },
            },
          },
          { runValidators: true }
        );
        await User.updateOne(
          { _id: req.userId },
          {
            $addToSet: { following: targetUserId },
          }
        );
        res
          .status(200)
          .json({ message: "Followed the user.", followStatus: true });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Save card
export const saveCard = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { cardId } = req.body;
    if (!cardId) {
      res.status(400).json({ message: "No provided card Id." });
      return;
    }
    if (!req.userId) {
      res.status(400).json({ message: "No provided user Id." });
      return;
    }
    try {
      const card = await Card.findById(cardId).select("savers userId").lean();
      if (!card) {
        res.status(404).json({ message: "Card not found." });
        return;
      }
      // Increase clicks if not the card owner
      if (req.userId !== card?.userId?.toString()) {
        await Promise.all([
          Card.updateOne({ _id: cardId }, { $inc: { clicks: 1 } }),
          User.updateOne(
            { _id: req.userId },
            {
              $addToSet: { cardsClicksViewer: new Date() },
            }
          ),
          User.updateOne(
            { _id: card?.userId },
            {
              $addToSet: { cardsClicksCreator: new Date() },
            }
          ),
        ]);
      }
      if (card?.savers.some((key) => key.userId === req.userId)) {
        if (req.userId === card?.userId?.toString()) {
          await Card.updateOne(
            { _id: cardId },
            {
              $pull: { savers: { userId: req.userId } },
            }
          );
        } else {
          await Promise.all([
            Card.updateOne(
              { _id: cardId },
              {
                $pull: { savers: { userId: req.userId } },
                $inc: { saved: -1 },
              }
            ),
            User.updateOne(
              { _id: req.userId },
              {
                $pull: { savedCardsViewer: { cardId: cardId } },
              }
            ),
            User.updateOne(
              { _id: card.userId },
              {
                $pull: {
                  savedCardsCreator: { userId: req.userId, cardId: cardId },
                },
              }
            ),
          ]);
        }
        res.status(200).json({
          message: "Unsaved card.",
          saved: false,
        });
      } else {
        const saveEntry = { time: new Date(), userId: req.userId };
        if (req.userId === card?.userId?.toString()) {
          await Card.updateOne(
            { _id: cardId },
            {
              $addToSet: { savers: saveEntry },
            }
          );
        } else {
          await Promise.all([
            Card.updateOne(
              { _id: cardId },
              {
                $addToSet: { savers: saveEntry },
                $inc: { saved: 1 },
              }
            ),
            User.updateOne(
              { _id: req.userId },
              {
                $addToSet: {
                  savedCardsViewer: { time: new Date(), cardId },
                },
              }
            ),
            User.updateOne(
              { _id: card.userId },
              {
                $addToSet: {
                  savedCardsCreator: {
                    time: new Date(),
                    cardId,
                    userId: req.userId,
                  },
                },
              }
            ),
          ]);
        }
        res.status(200).json({
          message: "Saved card.",
          saved: true,
        });
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Increase card clicks
export const increaseClicks = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { cardId } = req.body;
    if (!cardId) {
      res.status(400).json({ message: "No provided card Id." });
      return;
    }
    try {
      const card = await Card.findById(cardId).select("userId").lean();
      if (req.userId) {                                                   
        if (req.userId !== card?.userId.toString()) {
          await Promise.all([
            Card.updateOne({ _id: cardId }, { $inc: { clicks: 1 } }),
            User.updateOne(
              { _id: req.userId },
              {
                $addToSet: { cardsClicksViewer: new Date() },
              }
            ),
            User.updateOne(
              { _id: card?.userId },
              {
                $addToSet: { cardsClicksCreator: new Date() },
              }
            ),
          ]);
        }
      } else {
        await Promise.all([
          await Card.updateOne({ _id: cardId }, { $inc: { clicks: 1 } }),
          await User.updateOne(
            { _id: card?.userId },
            {
              $addToSet: { cardsClicksCreator: new Date() },
            }
          ),
        ]);
      }
      res.status(200).json({ message: "Clicks increased." });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);
// Record video watch time
export const watchTime = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { watchTime, videoId } = req.body;
    if (!watchTime) {
      res.status(400).json({ message: "No provided watch time." });
    }
    if (!videoId) {
      res.status(400).json({ message: "No provided videoId." });
    }
    if (!req.userId) {
      return;
    }
    try {
      await Video.updateOne(
        { _id: videoId },
        {
          $inc: { watchTime: Math.floor(watchTime) },
        }
      );
      const user = await Video.findById(videoId).select("userId").lean();
      await User.updateOne(
        { _id: user?.userId },
        {
          $inc: { watchTime: Math.floor(watchTime) },
        }
      );
      // console.log("watchtime success", watchTime);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);
