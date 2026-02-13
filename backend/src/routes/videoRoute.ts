import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware";
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
  getRandomVideo,
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
videoRoutes.route("/getvideos").get(optionalAuthMiddleware, getVideos);
videoRoutes.route("/gethomevideos").get(optionalAuthMiddleware, getHomeVideos);
videoRoutes.route("/getrandomvideo").get(getRandomVideo);
videoRoutes.route("/getvideo").get(optionalAuthMiddleware, getVideo);
videoRoutes.route("/geteditvideo").get(authMiddleware, getEditVideo);
videoRoutes.route("/getmyvideo").get(authMiddleware, getMyVideo);
videoRoutes.route("/addlike").put(authMiddleware, addLike);
videoRoutes.route("/getmyvideos").get(authMiddleware, getMyVideos);
videoRoutes.route("/getcards").get(authMiddleware, getCards);
videoRoutes.route("/getuservideos").get(optionalAuthMiddleware, getUserVideos);
videoRoutes.route("/followuser").put(authMiddleware, followUser);
videoRoutes.route("/getuserinfo").get(authMiddleware, getUserInfo);
videoRoutes
  .route("/setuserinfo")
  .post(authMiddleware, upload.single("file"), setUserInfo);
videoRoutes.route("/checkusername").post(authMiddleware, checkUserName);
videoRoutes.route("/getusername").get(authMiddleware, getUserName);
videoRoutes.route("/getusername").get(authMiddleware, getUserName);
videoRoutes.route("/savecard").put(authMiddleware, saveCard);
videoRoutes.route("/increaseclicks").put(optionalAuthMiddleware, increaseClicks);
videoRoutes.route("/watchtime").put(optionalAuthMiddleware, watchTime);
videoRoutes
  .route("/storevideofile")
  .post(authMiddleware, upload.single("file"), storeVideoFile);

export default videoRoutes;
