import React, { useContext, useEffect, useState } from "react";
import "./Attendance.css";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../../Shared/Context/Auth-context";

const Attendance = () => {
  const auth = useContext(AuthContext);

  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { classNumber } = useParams();
  const attendanceKey = `attendance_${classNumber}`;

  const saveAttendanceData = () => {
    const data = {
      students: students,
      expiration: Date.now() + 10 * 60 * 60 * 1000, // Expiration time set to 24 hours from now
    };
    localStorage.setItem(attendanceKey, JSON.stringify(data));
    const attendanceDate = new Date().toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    localStorage.setItem("attendanceDate", attendanceDate);
    setAttendance(attendanceDate);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const storedAttendance = JSON.parse(
          localStorage.getItem(attendanceKey)
        );

        if (
          storedAttendance &&
          storedAttendance.expiration > Date.now() &&
          storedAttendance.students.length > 0
        ) {
          setStudents(storedAttendance.students);
        } else {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/students/get/class/${classNumber}`
          );
          setStudents(responseData.students);
          saveAttendanceData();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const updateAttendanceData = () => {
      const now = new Date();
      const storedDate = new Date(localStorage.getItem("attendanceDate"));

      if (
        now.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" }) !==
        storedDate.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })
      ) {
        localStorage.removeItem(attendanceKey);
        localStorage.setItem(
          "attendanceDate",
          now.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })
        );
        saveAttendanceData();
      }
    };

    const interval = setInterval(updateAttendanceData, 60000);

    fetchStudents();

    return () => {
      clearInterval(interval);
    };
  }, [classNumber, sendRequest]);

  useEffect(() => {
    saveAttendanceData();
  }, [students, attendanceKey]);

  const markAttendance = async (id, present) => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
      });

      const existingAttendance = students.find(
        (student) => student._id === id && student.present !== undefined
      );

      if (existingAttendance && existingAttendance.date === formattedDate) {
        await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/attendance/student/${existingAttendance._id}`,
          "PATCH",
          JSON.stringify({ present: !existingAttendance.present }),
          {
            "Content-Type": "application/json",
          }
        );

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === id && student.present !== undefined
              ? { ...student, present: !existingAttendance.present }
              : student
          )
        );
      } else {
        const attendanceData = {
          studentId: id,
          date: formattedDate,
          present,
        };

        await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/attendance/save",
          "POST",
          JSON.stringify(attendanceData),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === id ? { ...student, present } : student
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sortedStudents = [...students].sort((a, b) =>
    a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })
  );
  const attendanceDate = new Date();
  const formattedDate = moment(attendanceDate).format("DD-MM-YYYY");
  return (
    <div className="attendance-system">
      <h2>Attendance System</h2>
      <h2>Date: {formattedDate}</h2>

      <ErrorModal error={error} onClear={clearError} />

      {sortedStudents.length > 0 ? (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.rollNumber}</td>
                <td>{student.studentName}</td>
                <td>
                  {student.present ? (
                    <button className="present-button" disabled>
                      Present
                    </button>
                  ) : (
                    <button
                      className="mark-present-button"
                      onClick={() => markAttendance(student._id, true)}
                    >
                      Mark Present
                    </button>
                  )}
                  &nbsp;
                  {!student.present && (
                    <button className="absent-button" disabled>
                      Absent
                    </button>
                  )}
                  {student.present && (
                    <button
                      className="mark-absent-button"
                      onClick={() => markAttendance(student._id, false)}
                    >
                      Mark Absent
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
};

export default Attendance;
