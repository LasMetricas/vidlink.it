import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../../middleware/authMiddleware";
import Video from "../../models/videoModel";
import { Response } from "express";
import User from "../../models/userModel";
import Card, { ICard } from "../../models/cardModel";

// Get videos
export const getVideos = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const allVideos = await Video.find({})
        .select("videoLink views card duration title userId _id createdAt")
        .populate("user")
        .sort({ createdAt: -1 })
        .lean();
      if (!req.userId) {
        res.status(200).json({ message: "All videos found.", allVideos });
        return;
      } else {
        const userData = await User.findById(req.userId)
          .select("following")
          .lean();
        const followingUserIds = userData?.following || [];
        const followingVideos = await Video.find({
          userId: { $in: followingUserIds },
        })
          .select("videoLink views card duration title userId _id createdAt")
          .populate("user")
          .sort({ createdAt: -1 })
          .lean();
        res.status(200).json({
          message: "All and following videos found.",
          allVideos,
          followingVideos,
        });
      }
    } catch (error: any) {
      console.log("getVideos", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get homepage videos
export const getHomeVideos = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const homeVideos = await Video.find({})
        .select("videoLink views duration title userId _id createdAt")
        .populate("user")
        .limit(9)
        .lean();

      res.status(200).json({
        message: "homepage videos found.",
        homeVideos,
      });
    } catch (error: any) {
      console.log("getHomeVideos", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get video detail
export const getVideo = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const videoId = req.header("x-video-id");
    if (!videoId) {
      res.status(400).json({ message: "No videoId provided." });
      return;
    }

    try {
      const videoInfo = await Video.findById(videoId)
        .select("userId title description videoLink duration")
        .populate<{ cards: ICard[] }>("cards")
        .lean();
      if (!videoInfo) {
        res.status(404).json({ message: "Video not found." });
        return;
      }
      const userInfo = await User.findById(videoInfo.userId)
        .select("totalVideos userName followers picture")
        .lean();
      const userVideos = await Video.find({ userId: videoInfo.userId })
        .select("videoLink title duration views createdAt userId _id")
        .populate("user")
        .limit(8)
        .lean();
      const relatedVideos = await Video.find({})
        .select("videoLink title duration views createdAt userId _id")
        .populate("user")
        .limit(8)
        .lean();
      let like = false;
      let owner = false;
      let followStatus = false;
      if (req.userId) {
        const user = await User.findById(req.userId)
          .select("likeVideosViewer")
          .lean();
        if (user && user.likeVideosViewer) {
          like = user.likeVideosViewer.some((key) => key.videoId === videoId);
        }
        if (videoInfo.userId.toString() === req.userId) {
          owner = true;
        }
        if (userInfo?.followers) {
          followStatus = userInfo?.followers.some(
            (key) => key.userId === req.userId && key.create
          );
        }
        if (videoInfo?.cards) {
          videoInfo.cards.forEach((card: ICard) => {
            card.isSaved = card.savers.some((key) => key.userId === req.userId);
            card.savers = [];
          });
        }
        if (req.userId !== videoInfo.userId.toString()) {
          await Promise.all([
            User.updateOne(
              { _id: userInfo?._id },
              {
                $addToSet: { videoViews: new Date() },
              }
            ),
            Video.updateOne({ _id: videoId }, { $inc: { views: 1 } }),
          ]);
        }
      } else {
        await Promise.all([
          User.updateOne(
            { _id: userInfo?._id },
            {
              $addToSet: { videoViews: new Date() },
            }
          ),
          Video.updateOne({ _id: videoId }, { $inc: { views: 1 } }),
        ]);
      }
      res.status(200).json({
        message: "Video found",
        videoInfo,
        userInfo: { ...userInfo, like, owner, followers: [] },
        userVideos,
        relatedVideos,
        followStatus,
      });
    } catch (error: any) {
      console.error("getVideo", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get edit video
export const getEditVideo = expressAsyncHandler(
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
      const videoInfo = await Video.findOne({
        _id: videoId,
        userId: req.userId,
      })
        .select("userId title description videoLink duration info")
        .populate("cards")
        .lean();

      if (videoInfo) {
        res.status(200).json({ message: "Edit video found.", videoInfo });
      } else {
        res.status(404).json({ message: "Edit video not found." });
      }
    } catch (error: any) {
      console.error("Error in getEditVideo:", error);
      res.status(500).json({
        message:
          error.message || "An error occurred while getting a edit video",
      });
      return;
    }
  }
);

// Get my video detail
export const getMyVideo = expressAsyncHandler(
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
      const videoInfo = await Video.findById(videoId)
        .select(
          "_id title description userId videoLink info likes duration views"
        )
        .populate<{ cards: ICard[] }>("cards")
        .lean();
      if (!videoInfo) {
        res.status(404).json({ message: "Video not found." });
        return;
      }
      if (videoInfo.userId.toString() !== req.userId) {
        res.status(400).json({ message: "Not a user video." });
        return;
      }
      if (videoInfo?.cards) {
        videoInfo.cards.forEach((card: ICard) => {
          card.isSaved = card.savers.some((key) => key.userId === req.userId);
          card.savers = [];
        });
      }
      const moreVideos = await Video.find({ userId: req.userId })
        .select(
          "videoLink title description duration card views createdAt userId _id"
        )
        .populate("user")
        .limit(4)
        .lean();

      res.status(200).json({
        message: "Video found",
        videoInfo,
        moreVideos,
      });
    } catch (error: any) {
      console.error("getMyVideo", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get my videos
export const getMyVideos = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }
    try {
      const myVideos = await Video.find({ userId: req.userId })
        .select("videoLink title info views duration card createdAt")
        .lean();
      const likes = await User.findById(req.userId)
        .select("likeVideosViewer")
        .lean();
      const likeVideosIds =
        likes?.likeVideosViewer?.map((key) => key.videoId) || [];
      const myLikesVideos = await Video.find({
        _id: { $in: likeVideosIds },
      })
        .select("videoLink title")
        .lean();
      const userInfo = await User.findById(req.userId)
        .select(
          "totalVideos totalCards followers following tiktok youtube linkedin instagram userName picture bio"
        )
        .lean();
      const followerNumber = userInfo?.followers.filter(
        (key) => key.create
      ).length;
      const followingNumber = userInfo?.following?.length;
      res.status(200).json({
        message: "my videos found",
        myVideos,
        myLikesVideos,
        userInfo: {
          ...userInfo,
          followers: followerNumber,
          following: followingNumber,
        },
      });
    } catch (error: any) {
      console.log("getMyVideos", error);
      res.status(500).json({ message: error.message });
    }
  }
);
// Get cards
export const getCards = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided userId." });
      return;
    }
    try {
      // Fetch cards (sorted by videoId & no)
      const cards = await Card.find({
        $or: [{ userId: req.userId }, { "savers.userId": req.userId }],
      })
        .sort({ videoId: 1, no: 1 })
        .lean();
      // Extract unique userIds
      const userIds = [...new Set(cards.map((card) => card.userId))];
      // Fetch all usernames in one query
      const users = await User.find({ _id: { $in: userIds } })
        .select("userName")
        .lean();
      // Create lookup map { userId: userName }
      const userMap: Record<string, string> = {};
      users.forEach((user) => {
        userMap[user._id.toString()] = user.userName;
      });
      // Process and group cards
      const groupedCards: {
        title: string;
        userName: string;
        videoId: string;
        cards: ICard[];
      }[] = [];
      for (const card of cards) {
        card.isSaved = card.savers.some((key) => key.userId === req.userId);
        card.savers = []; // Clear savers list for security reasons
        let group = groupedCards.find(
          (g) => g.videoId === String(card.videoId)
        );
        if (!group) {
          group = {
            title: card.title,
            userName: userMap[card.userId.toString()] || "Unknown",
            videoId: String(card.videoId),
            cards: [],
          };
          groupedCards.push(group);
        }
        group.cards.push(card);
      }
      res.status(200).json({ message: "Cards found.", cards: groupedCards });
    } catch (error: any) {
      console.log("getCards", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get user videos
export const getUserVideos = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.header("x-user-id");
    if (!userId) {
      res.status(400).json({ message: "No userId provided." });
      return;
    }
    try {
      const [userVideos, userInfo] = await Promise.all([
        Video.find({ userId: userId })
          .select("videoLink title info views duration card createdAt")
          .lean(),
        User.findById(userId)
          .select(
            "totalVideos totalCards followers following tiktok youtube linkedin instagram userName picture email"
          )
          .lean(),
      ]);
      const relatedUsers = await User.find({
        _id: { $in: userInfo?.following || [] },
      })
        .select("userName picture totalVideos followers totalCards")
        .limit(5) // You can select only what you need
        .lean();
      await User.findByIdAndUpdate(userId, { $inc: { profileViews: 1 } });
      let followStatus = false;
      if (req.userId && userInfo?.followers) {
        followStatus = userInfo?.followers.some(
          (key) => key.userId === req.userId
        );
      }
      const followerNumber = userInfo?.followers.filter(
        (key) => key.create
      ).length;
      const modifiedRelatedUsers = relatedUsers.map((user) => ({
        ...user,
        followers: user.followers?.filter((f) => f.create).length || 0,
      }));
      const followingNumber = userInfo?.following?.length;
      res.status(200).json({
        message: "my videos found",
        userVideos,
        userInfo: {
          ...userInfo,
          followers: followerNumber,
          following: followingNumber,
        },
        relatedUsers: modifiedRelatedUsers,
        followStatus,
      });
    } catch (error: any) {
      console.log("getUserVideos", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get user info
export const getUserInfo = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No userId provided." });
      return;
    }
    try {
      const userInfo = await User.findById(req.userId)
        .select("userName picture gender bio instagram tiktok youtube linkedin")
        .lean();
      const checkingNames = await User.find({}).select("userName").lean();
      res
        .status(200)
        .json({ message: "user info found.", userInfo, checkingNames });
    } catch (error: any) {
      console.log("getUserInfo", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get user name
export const getUserName = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const userName = await User.findById(req.userId)
        .select("userName")
        .lean();
      res
        .status(200)
        .json({ message: "user info found.", userName: userName?.userName });
    } catch (error: any) {
      console.log("getUserName", error);
      res.status(500).json({ message: error.message });
    }
  }
);
