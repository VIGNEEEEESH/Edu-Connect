const express=require("express")
const mongoose = require("mongoose");
const { check } = require("express-validator");
const router = express.Router();
const teacherController=require("../Controllers/Teachers-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");


router.get("/get/allteachers",teacherController.getTeachers)
router.get("/get/:email",teacherController.getTeacherByEmail)
router.post("/login",teacherController.login)
router.use(checkAuth)
router.post("/createteacher", fileUpload.single("image"), [
  check("name").notEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),
  check("qualification").notEmpty(),
  check("subjects").notEmpty()
],teacherController.createTeacher);



router.patch("/update/:email",fileUpload.single("image"),[
    check("name").notEmpty(),
    check("password").isLength({min:6}),
    check("qualification").notEmpty(),
    check("subjects").notEmpty()
],teacherController.updateTeacher)
router.delete("/delete/:email",teacherController.deleteTeacher)
module.exports = router;
