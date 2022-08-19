import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

const routes = {};

routes.getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 2;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      totalPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

routes.getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await PostMessage.findById(id);
  res.status(200).json(post);
};

routes.createPost = async (req, res) => {
  try {
    const post = req.body;
    if (!req.userId) return res.status(401).send("Unauthorized");
    const newPost = await PostMessage.create({
      ...post,
      creator: req.userId,
      createdAt: new Date().toISOString(),
    });
    await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

routes.updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Invalid ID");

  const updatePost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });
  res.json(updatePost);
};

routes.deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Invalid ID");
  await PostMessage.findByIdAndDelete(_id);
  res.status(204).send();
};

routes.likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!req.userId) return res.status(401).send("Unauthorized");

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Invalid ID");
  const post = await PostMessage.findById(_id);

  const index = post.likes.findIndex((id) => id.toString() === req.userId);

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id.toString() !== req.userId);
  }

  const updatePost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });
  res.json(updatePost);
};

routes.getPostBySearch = async (req, res) => {
  const { search, tags } = req.query;

  try {
    const title = new RegExp(search, "i");
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};
export default routes;
