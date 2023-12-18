const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/Student-controllers");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");


router.get("/allStudents", studentController.getAllStudents);
router.get("/get/class/:classNumber", studentController.getStudentsByClass);
router.get("/studentId/:studentId", studentController.getStudentByStudentId);
router.get("/Id/:id", studentController.getStudentById);
router.get("/studentName/:studentName", studentController.getStudentByName);
router.use(checkAuth)
router.post(
  "/addStudent",
  [
    check("studentName").notEmpty(),
    check("fatherName").notEmpty(),
    check("motherName").notEmpty(),
    check("classNumber").notEmpty(),
    check("caste").notEmpty(),
    check("progress").notEmpty(),
    check("motherTongue").notEmpty(),
    check("bloodGroup").notEmpty(),
    check("fatherNumber").notEmpty(),
  check("motherNumber").notEmpty(),
  check("fatherOccupation").notEmpty(),
  check("motherOccupation").notEmpty(),
    check("rollNumber").notEmpty(),
    check("studentId").notEmpty(),
  ],
  studentController.createStudent
);
router.patch("/update/:id", [
  check("studentName").notEmpty(),
  check("fatherName").notEmpty(),
  check("motherName").notEmpty(),
  check("classNumber").notEmpty(),
  check("caste").notEmpty(),
  check("progress").notEmpty(),
  check("motherTongue").notEmpty(),
  check("bloodGroup").notEmpty(),
  check("fatherNumber").notEmpty(),
  check("motherNumber").notEmpty(),
  check("fatherOccupation").notEmpty(),
  check("motherOccupation").notEmpty(),
  check("rollNumber").notEmpty()
],studentController.updateStudentById);
router.delete("/delete/:id",studentController.deleteStudentById)
module.exports = router;
