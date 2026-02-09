import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  checkUserName,
  publishVideo,
  setUserInfo,
  storeVideoFile,
} from "../controllers/videoControllers/postVideoController";
import multer from "multer";
import {
  getCards,
  getEditVideo,
  getHomeVideos,
  getMyVideo,
  getMyVideos,
  getUserInfo,
  getUserName,
  getUserVideos,
  getVideo,
  getVideos,
} from "../controllers/videoControllers/getVideoController";
import {
  addLike,
  followUser,
  increaseClicks,
  saveCard,
  watchTime,
} from "../controllers/videoControllers/putVideoController";
import { deleteVideo } from "../controllers/videoControllers/deleteVideoController";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const videoRoutes = express.Router();

videoRoutes.route("/publish").post(authMiddleware, publishVideo);
videoRoutes.route("/delete").delete(authMiddleware, deleteVideo);
videoRoutes.route("/getvideos").get(authMiddleware, getVideos);
videoRoutes.route("/gethomevideos").get(authMiddleware, getHomeVideos);
videoRoutes.route("/getvideo").get(authMiddleware, getVideo);
videoRoutes.route("/geteditvideo").get(authMiddleware, getEditVideo);
videoRoutes.route("/getmyvideo").get(authMiddleware, getMyVideo);
videoRoutes.route("/addlike").put(authMiddleware, addLike);
videoRoutes.route("/getmyvideos").get(authMiddleware, getMyVideos);
videoRoutes.route("/getcards").get(authMiddleware, getCards);
videoRoutes.route("/getuservideos").get(authMiddleware, getUserVideos);
videoRoutes.route("/followuser").put(authMiddleware, followUser);
videoRoutes.route("/getuserinfo").get(authMiddleware, getUserInfo);
videoRoutes
  .route("/setuserinfo")
  .post(authMiddleware, upload.single("file"), setUserInfo);
videoRoutes.route("/checkusername").post(authMiddleware, checkUserName);
videoRoutes.route("/getusername").get(authMiddleware, getUserName);
videoRoutes.route("/getusername").get(authMiddleware, getUserName);
videoRoutes.route("/savecard").put(authMiddleware, saveCard);
videoRoutes.route("/increaseclicks").put(authMiddleware, increaseClicks);
videoRoutes.route("/watchtime").put(authMiddleware, watchTime);
videoRoutes
  .route("/storevideofile")
  .post(authMiddleware, upload.single("file"), storeVideoFile);

export default videoRoutes;
