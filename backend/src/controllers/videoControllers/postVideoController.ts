import { Response } from "express";
import Video from "../../models/videoModel";
import expressAsyncHandler from "express-async-handler";
import { CustomRequest } from "../../middleware/authMiddleware";
import User from "../../models/userModel";
import { S3Client, ObjectCannedACL } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import Card from "../../models/cardModel";
import DraftVideo from "../../models/draftVideoModel";
import DraftCard from "../../models/draftCardModel";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  logger: console, // Debugging
});

export interface CardType {
  isSaved: boolean;
}

// Publish video and card
export const publishVideo = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided user Id." });
      return;
    }

    const { videoLink, duration, title, description, info, cards } = req.body;

    const status = req.query.status as string;
    const videoId = req.query.videoId as string | undefined;
    let parsedCards: CardType[];
    try {
      parsedCards = typeof cards === "string" ? JSON.parse(cards) : cards;
    } catch (error) {
      res.status(400).json({ message: "Invalid cards data" });
      return;
    }

    try {
      if (status === "edit") {
        if (!videoId) {
          res.status(400).json({ message: "Missing videoId for edit mode." });
          return;
        }

        const video = await Video.findByIdAndUpdate(
          videoId,
          {
            userId: req.userId,
            videoLink,
            duration: Number(duration),
            title,
            description,
            info,
            card: parsedCards.length,
          },
          { new: true } // Return updated document
        ).lean();

        if (!video) {
          res.status(404).json({ message: "Video not found." });
          return;
        }
        const time = new Date();
        const newCards = await Promise.all(
          parsedCards.map((card: any) => {
            const cardData = {
              ...card,
              videoId: videoId,
              userId: req.userId,
              title: title,
              savers: card.isSaved
                ? [{ time: new Date(), userId: req.userId }]
                : [],
              isSaved: card.isSaved,
            };
            if (card._id) {
              return Card.findByIdAndUpdate(card._id, cardData, { new: true });
            } else {
              return Card.create(cardData);
            }
          })
        );

        const existingCards = await Card.find({ videoId: video._id });
        const staleCards = existingCards.filter(
          (card) => card.updatedAt && card.updatedAt < time
        );

        await Promise.all(
          staleCards.map((card) => {
            return Card.findByIdAndDelete(card._id); // Now it's awaited
          })
        );

        res
          .status(201)
          .json({ message: "Video updated", videoId, newCards: newCards });
        return;
      } else {
        const video = new Video({
          userId: req.userId,
          videoLink,
          duration: Number(duration),
          title,
          description,
          info,
          card: parsedCards.length,
        });

        await video.save();

        await Promise.all(
          parsedCards.map((card: any) =>
            Card.create({
              link: card.link,
              name: card.name,
              start: card.start,
              no: card.no,
              videoId: video._id,
              userId: req.userId,
              title: video.title,
              savers: card.isSaved
                ? [{ time: new Date(), userId: req.userId }]
                : [],
              isSaved: card.isSaved,
            })
          )
        );

        await User.updateOne(
          { _id: req.userId },
          {
            $inc: {
              totalVideos: 1,
              totalCards: parsedCards.length,
            },
          }
        );
        if (status === "draft") {
          console.log(status, videoId);
          const res1 = await DraftVideo.deleteOne({
            _id: videoId,
            userId: req.userId,
          });
          const res2 = await DraftCard.deleteMany({
            _id: videoId,
            userId: req.userId,
          });
        }
        res.status(201).json({ message: "Video created", videoId: video._id });
        return;
      }
    } catch (error: any) {
      console.error("Error in publishVideo:", error);
      res.status(500).json({
        message:
          error.message || "An error occurred while publishing the video",
      });
      return;
    }
  }
);

// Check user name
export const checkUserName = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { userName } = req.body;
    if (!userName) {
      res.status(400).json({ message: "No user name provided." });
      return;
    }
    try {
      const isAlreadyName = await User.findOne({ userName: userName })
        .select("_id")
        .lean();
      if (isAlreadyName && isAlreadyName._id != req.userId) {
        res
          .status(200)
          .json({ message: "Username is already taken.", isAlreadyOne: true });
        return;
      }
      res
        .status(200)
        .json({ message: "Username is available.", isAlreadyOne: false });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Set user info
export const setUserInfo = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { userName, gender, bio, instagram, tiktok, youtube, linkedin } =
      req.body;
    const file = req.file;
    try {
      let picture = undefined;
      if (file) {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME as string,
          Key: `avatar/${Date.now()}-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: ObjectCannedACL.public_read,
        };
        console.log("Starting S3 upload...");
        const upload = new Upload({
          client: s3Client,
          params: params,
        });
        try {
          const s3Response = await upload.done();
          console.log("S3 upload successful");
          picture = s3Response.Location;
        } catch (error) {
          console.error("Error uploading to S3:", error);
          throw new Error("Failed to upload video to S3");
        }
      }
      const isAlreadyName = await User.findOne({ userName: userName })
        .select("userName")
        .lean();
      if (isAlreadyName && isAlreadyName._id != req.userId && userName) {
        res.status(400).json({ message: "Already exist user name." });
        return;
      }
      const userInfo = await User.findByIdAndUpdate(
        { _id: req.userId },
        {
          userName,
          picture,
          gender,
          bio,
          instagram,
          tiktok,
          youtube,
          linkedin,
        },
        { runValidators: true, new: true }
      );
      res.status(200).json({
        message: "User info saved.",
        user: { userName, picture: userInfo?.picture },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export const storeVideoFile = expressAsyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.userId) {
      res.status(400).json({ message: "No provided user Id." });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "Video file is required" });
      return;
    }

    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `videos/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: ObjectCannedACL.public_read,
      };

      console.log("Starting S3 upload...");

      const upload = new Upload({
        client: s3Client,
        params,
      });

      const s3Response = await upload.done();

      console.log("S3 upload successful");

      res.status(200).json({
        message: "Video upload successful.",
        videoLink: s3Response.Location || "",
      });
      return;
    } catch (error: any) {
      console.error("Error uploading to S3:", error);
      res.status(500).json({ message: "Failed to upload video to S3" });
      return;
    }
  }
);
