const express = require("express");
const router = express.Router();
const postControllers = require("../Controllers/Post-controllers");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");


router.post("/post/:classNumber",fileUpload.single("image"), postControllers.createPost);
router.get("/get", postControllers.getPosts);
router.get("/get/class/:classNumber", postControllers.getPostsByClass);
router.patch(
    '/post/:postId',
    [check('replies').isArray()],
    postControllers.updateReplies
  );
router.delete("/delete/:id",postControllers.deletePostById)
module.exports = router;
