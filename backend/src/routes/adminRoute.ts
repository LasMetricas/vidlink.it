import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getDataAdmin, handleUserStatus } from "../controllers/adminController";

const adminRoutes = express.Router();
adminRoutes.route("/getdataadmin").get(authMiddleware, getDataAdmin);
adminRoutes.route("/handleuserstatus").post(authMiddleware, handleUserStatus);

export default adminRoutes;
