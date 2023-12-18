const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth")

const attendanceController = require("../Controllers/Attendance-controllers");

// Create new attendance record

// Get attendance records for a specific student

router.get("/student/:studentId", attendanceController.getAttendanceByStudent);
router.get("/student/:studentId", attendanceController.getAttendanceByStudent);
router.get("/student/presentDays/:studentId", attendanceController.getAttendanceDaysByStudent);
router.get("/student/presentDays/:classNumber/:startDate/:endDate", attendanceController.getAttendanceDaysByClass);
router.use(checkAuth)
router.post("/save", attendanceController.createAttendance);

// Update attendance record
router.patch("/student/:id", attendanceController.updateAttendance);

// Delete attendance record
router.delete("/:attendanceId", attendanceController.deleteAttendance);

module.exports = router;
