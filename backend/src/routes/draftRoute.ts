import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getDraft, getDrafts, saveDraft ,deleteDraft} from "../controllers/draftController";

const draftRoutes = express.Router();

draftRoutes.route("/savedraft").post(authMiddleware, saveDraft);
draftRoutes.route("/getdraft").get(authMiddleware, getDraft);
draftRoutes.route("/getdrafts").get(authMiddleware, getDrafts);
draftRoutes.route("/deletedraft").delete(authMiddleware, deleteDraft);

export default draftRoutes;
