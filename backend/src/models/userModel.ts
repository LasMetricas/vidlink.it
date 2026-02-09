import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  name: String;
  picture: string;
  userName: string;
  gender: string;
  bio: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  role: string;
  status: string;
  loginAt: Date[];
  totalVideos: number;
  totalCards: number;
  followers: { time: Date; create: boolean; userId: string }[];
  following: string[];
  likeVideosViewer: { time: Date; videoId: string }[];
  likeVideosCreator: { time: Date; userId: string }[];
  cardsClicksCreator: Date[];
  cardsClicksViewer: Date[];
  savedCardsCreator: { time: Date; userId: string }[];
  savedCardsViewer: { time: Date; userId: string }[];
  videoViews: Date[];
  profileViews: number;
  watchTime: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    userName: { type: String, default: "" },
    name: { type: String, required: true },
    picture: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other", ""] },
    bio: { type: String, fdefault: "" },
    instagram: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    youtube: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    status: { type: String, enum: ["blocked", "active"], default: "active" },
    loginAt: { type: [Date], default: [] },
    followers: {
      type: [
        {
          time: { type: Date },
          create: { type: Boolean },
          userId: { type: String, required: true },
        },
      ],
      default: [],
    },
    following: { type: [String], default: [] },
    totalVideos: { type: Number, default: 0 },
    totalCards: { type: Number, default: 0 },
    likeVideosViewer: {
      type: [
        {
          time: { type: Date, required: true },
          videoId: { type: String, required: true },
        },
      ],
      default: [],
    },
    likeVideosCreator: {
      type: [
        {
          time: { type: Date, required: true },
          videoId: { type: String, required: true },
          userId: { type: String, required: true },
        },
      ],
      default: [],
    },
    cardsClicksCreator: { type: [Date], default: [] },
    cardsClicksViewer: { type: [Date], default: [] },
    savedCardsCreator: {
      type: [
        {
          time: { type: Date, required: true },
          cardId: { type: String, required: true },
          userId: { type: String, required: true },
        },
      ],
      default: [],
    },
    savedCardsViewer: {
      type: [
        {
          time: { type: Date },
          cardId: { type: String, required: true },
        },
      ],
      default: [],
    },
    videoViews: { type: [Date], default: [] },
    profileViews: { type: Number, default: 0 },
    watchTime: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
