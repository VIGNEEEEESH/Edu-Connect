const express=require("express")
const mongoose = require("mongoose");
const { check } = require("express-validator");
const router = express.Router();
const adminController=require("../Controllers/Admin-controllers")
const fileUpload=require("../middleware/file-upload")

router.post("/createadmin",fileUpload.single("image"), [
  check("name").notEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),
  
  
],adminController.createAdmin);
router.get("/get/alladmins",adminController.getAdmins)
router.get("/get/adminIds",adminController.getAdminIds)
router.post("/login",adminController.login)
router.get("/get/:email",adminController.getAdminByEmail)
router.patch("/update/:email",[
    check("name").notEmpty(),
    check("password").isLength({min:6}),
    
    
],adminController.updateAdmin)
router.delete("/delete/:email",adminController.deleteAdmin)
module.exports = router;
