const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const gradingControllers = require("../Controllers/Grading-controllers");
const checkAuth = require("../middleware/check-auth");

router.get("/get", gradingControllers.getGrades);
router.get("/getById/:id", gradingControllers.getGradesById);
router.get("/getByClass/:classNumber/:examName", gradingControllers.getGradesByClass);
router.get("/getExams/:classNumber", gradingControllers.getExamNamesByClass);
router.use(checkAuth)
router.post(
  "/add",
  [check("student").notEmpty(),
  check("studentName").notEmpty(),
  check("rollNumber").notEmpty(),
  check("examName").notEmpty(),
  check("classNumber").notEmpty(),
  check("subjects").notEmpty(),
  check("totalMarks").notEmpty(),
  check("percentage").notEmpty(),
    
],
  gradingControllers.createGrades
);
router.post(
  "/add/multiple",
  [
    check("gradingData").isArray(),
    check("gradingData.*.student").notEmpty(),
    check("gradingData.*.studentName").notEmpty(),
    check("gradingData.*.rollNumber").notEmpty(),
    check("gradingData.*.examName").notEmpty(),
    check("gradingData.*.classNumber").notEmpty(),
    check("gradingData.*.subjects").isArray(),
    check("gradingData.*.totalMarks").isNumeric(),
    check("gradingData.*.percentage").isNumeric(),
  ],
  gradingControllers.createMultipleGrades
);
module.exports=router