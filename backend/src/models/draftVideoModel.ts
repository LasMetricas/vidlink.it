import mongoose, { Document, Schema, Model } from "mongoose";

interface IDraftVideo extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  info: string;
  videoLink: string;
  duration: number;
  card: number;
  expiresAt: Date;
}

const DraftVideoSchema = new Schema<IDraftVideo>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    info: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    videoLink: { type: String, default: "" },
    card: { type: Number, default: 0 },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

DraftVideoSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true, // Ensures a single object (not an array)
  options: { select: "userName picture" }, // Select only userName
});
DraftVideoSchema.virtual("draftCards", {
  ref: "DraftCard",
  localField: "_id",
  foreignField: "videoId",
  options: { sort: { no: 1 } },
});

const DraftVideo: Model<IDraftVideo> = mongoose.model<IDraftVideo>(
  "DraftVideo",
  DraftVideoSchema
);

export default DraftVideo;
