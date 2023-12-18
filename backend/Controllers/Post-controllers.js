const Post = require("../Models/Post");
const { validationResult } = require("express-validator");
const HttpError = require("../Models/http-error");

const createPost = async (req, res, next) => {
  const classNumber = req.params.classNumber;
  const { subject, content, replies } = req.body;

  // Validate input using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }

  const post = new Post({
    subject,
    classNumber,
    content,
    replies,
  });

  if (req.file) {
    post.image = req.file.path;
  }

  try {
    await post.save();
  } catch (err) {
    // Handle error
    return next(err);
  }

  res.status(201).json({ post });
};

const getPosts = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find();
  } catch (err) {
    // Handle error
    return next(err);
  }

  res.json({ posts });
};

const getPostsByClass = async (req, res, next) => {
  const classNumber = req.params.classNumber;
  let posts;
  try {
    posts = await Post.find({ classNumber: classNumber });
  } catch (err) {
    // Handle error
    return next(err);
  }

  res.json({ posts });
};

const deletePostById = async (req, res, next) => {
  const id = req.params.id;
  let post;
  try {
    post = await Post.findById(id);
    if (!post) {
      return next(new HttpError("Could not find the post, please try again", 404));
    }
    await post.deleteOne();
  } catch (err) {
    return next(err);
  }

  res.json({ message: "Post deleted successfully" });
};

const updateReplies = async (req, res, next) => {
  const postId = req.params.postId;
  const { replies } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the post",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError(
      "Could not find a post for the provided id",
      404
    );
    return next(error);
  }

  post.replies = replies;

  try {
    await post.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the post",
      500
    );
    return next(error);
  }

  res.status(200).json({ post });
};

module.exports = {
  createPost,
  getPosts,
  getPostsByClass,
  updateReplies,
  deletePostById
};
