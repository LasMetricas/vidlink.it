import mongoose, { Document, Schema, Model } from "mongoose";

export interface IDraftCard extends Document {
  videoId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  link: string;
  name: string;
  start: number;
  no: number;
  isSaved: boolean;
  expiresAt: Date;
}

const DraftCardSchema = new Schema<IDraftCard>(
  {
    videoId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, default: "" },
    link: { type: String, default: "" },
    name: { type: String, default: "" },
    start: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    isSaved: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const DraftCard: Model<IDraftCard> = mongoose.model<IDraftCard>(
  "DraftCard",
  DraftCardSchema
);

export default DraftCard;
