import express from "express";
import PostControllers from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/search", PostControllers.getPostBySearch);

router.get("/", PostControllers.getPosts);

router.get("/:id", PostControllers.getPostById);

router.post("/", auth, PostControllers.createPost);

router.patch("/:id", auth, PostControllers.updatePost);

router.delete("/:id", auth, PostControllers.deletePost);

router.patch("/:id/like", auth, PostControllers.likePost);
export default router;
