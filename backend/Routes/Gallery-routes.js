const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();
const galleryControllers=require("../Controllers/Gallery-controllers");
const checkAuth = require("../middleware/check-auth");

router.get("/get", galleryControllers.getImage);

router.use(checkAuth)
router.post("/add", fileUpload.single("image"),galleryControllers.addImage);

router.delete("/delete/:id", galleryControllers.deleteImageById);
module.exports=router