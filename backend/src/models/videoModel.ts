import mongoose, { Document, Schema, Model } from "mongoose";

interface IVideo extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  info: string;
  videoLink: string;
  duration: number;
  views: number;
  likes: number;
  card: number;
  watchTime: number;
  draft: boolean;
  isVertical: boolean;
}

const VideoSchema = new Schema<IVideo>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    info: { type: String, required: true },
    duration: { type: Number, required: true },
    videoLink: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    card: { type: Number, default: 0 },
    watchTime: { type: Number, default: 0 },
    draft: { type: Boolean, default: false },
    isVertical: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VideoSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true, // Ensures a single object (not an array)
  options: { select: "userName picture" }, // Select only userName
});
VideoSchema.virtual("cards", {
  ref: "Card",
  localField: "_id",
  foreignField: "videoId",
  options: { sort: { no: 1 } },
});

const Video: Model<IVideo> = mongoose.model<IVideo>("Video", VideoSchema);

export default Video;
