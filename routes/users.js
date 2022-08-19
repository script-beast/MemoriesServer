import express from "express";
import userController from "../controllers/users.js";

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);

export default router;
