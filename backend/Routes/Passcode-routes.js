const express=require("express")
const mongoose = require("mongoose");
const { check } = require("express-validator");
const router = express.Router();
const passcodeController=require("../Controllers/Passcode-controllers")
const fileUpload=require("../middleware/file-upload")

router.post("/createPasscode", [
  check("password").isLength({ min: 6 }),
  
  
],passcodeController.createPasscode);

router.post("/login",passcodeController.login)

module.exports = router;
