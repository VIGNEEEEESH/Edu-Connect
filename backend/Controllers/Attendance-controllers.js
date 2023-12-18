const Attendance = require("../Models/Attendance");

const createAttendance = async (req, res, next) => {
  const { studentId, present } = req.body;


  try {
    const currentDate = new Date();
    const date = new Date().toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    let existingAttendance = await Attendance.findOne({
      student: studentId,
      date: {
        $gte: new Date(date),
        $lt: new Date(
          currentDate.setDate(currentDate.getDate() )
        ).toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" }),
      },
    });

    if (existingAttendance) {
      existingAttendance.present = present;
      await existingAttendance.save();

      return res.status(200).json({ attendance: existingAttendance });
    }

    const attendance = new Attendance({
      student: studentId,
      date: currentDate,
      present,
    });

    await attendance.save();

    res.status(201).json({ attendance });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to create/update attendance record." });
  }
};

const getAttendanceByStudent = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const attendance = await Attendance.find({ student: studentId });

    res.json({ attendance });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance records." });
  }
};

const updateAttendance = async (req, res, next) => {
  const { id } = req.params;
  const { present } = req.body;

  try {
    const attendance = await Attendance.findOneAndUpdate(
      { _id: id },
      { present },
      { new: true }
    );

    res.json({ attendance });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update attendance record." });
  }
};

const deleteAttendance = async (req, res, next) => {
  const { attendanceId } = req.params;

  try {
    await Attendance.findByIdAndRemove(attendanceId);

    res.json({ message: "Attendance record deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete attendance record." });
  }
};

const getAttendanceDaysByStudent = async (req, res, next) => {
  const { studentId, startDate, endDate } = req.params;

  try {
    const attendance = await Attendance.find({
      student: studentId,
      date: { $gte: startDate, $lte: endDate },
    });

    const attendanceDays = attendance.map((record) =>
      record.date.toDateString()
    );

    res.json({ attendanceDays });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance records." });
  }
};




const getAttendanceDaysByClass = async (req, res, next) => {
  const { classNumber, startDate, endDate } = req.params;

  try {
    // Convert the classNumber to a number (if necessary)
    const classNum = classNumber;

    // Convert the startDate and endDate timestamps to Date objects
    const parsedStartDate = startDate;
    const parsedEndDate = endDate;

    // Check if startDate is before endDate
    if (parsedStartDate > parsedEndDate) {
      return res
        .status(400)
        .json({ message: "Invalid date range. Start date must be before end date." });
    }

    console.log("Parsed Start Date:", parsedStartDate);
    console.log("Parsed End Date:", parsedEndDate);

    const attendance = await Attendance.find({
      date: { $gte: parsedStartDate, $lte: parsedEndDate },
    }).populate({
      path: "student",
      select: "classNumber rollNumber studentName", // Select rollNumber and name fields from the Student model
      match: { classNumber: classNum }, // Filter by classNumber
    });

    // Filter out the attendance records with no matching student (classNumber not found)
    const filteredAttendance = attendance.filter((record) => record.student);

    // Group attendance records by student ID and unique dates
    const attendanceByStudent = filteredAttendance.reduce((acc, record) => {
      const studentId = record.student._id.toString();
      const dateString = record.date.toDateString();

      if (!acc[studentId]) {
        acc[studentId] = {
          rollNumber: record.student.rollNumber,
          studentName: record.student.studentName,
          presentDays: 0,
          uniqueDates: new Set(),
        };
      }

      if (!acc[studentId].uniqueDates.has(dateString)) {
        acc[studentId].uniqueDates.add(dateString);
        acc[studentId].presentDays++;
      }

      return acc;
    }, {});

    // Find the student with the most unique days
    let maxUniqueDays = 0;
    for (const studentId in attendanceByStudent) {
      const studentData = attendanceByStudent[studentId];
      if (studentData.uniqueDates.size > maxUniqueDays) {
        maxUniqueDays = studentData.uniqueDates.size;
      }
    }

    // Set totalDays based on the student with the most unique days for all students
    for (const studentId in attendanceByStudent) {
      const studentData = attendanceByStudent[studentId];
      studentData.totalDays = maxUniqueDays;
      delete studentData.uniqueDates;
    }

    console.log(Object.values(attendanceByStudent));

    // Send the Student variable in the response
    res.json({ students: Object.values(attendanceByStudent) });
  } catch (err) {
    console.error("Error:", err); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch attendance records." });
  }
};










module.exports = {
  createAttendance,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance,
  getAttendanceDaysByStudent,
  getAttendanceDaysByClass,
};
