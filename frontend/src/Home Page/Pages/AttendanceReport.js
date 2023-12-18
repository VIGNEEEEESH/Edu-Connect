import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import "./PerformancePage.css"; // Import the CSS file

const AttendanceReport = () => {
  const [students, setStudents] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { classNumber } = useParams();
  const { startDate } = useParams();
  const { endDate } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/attendance/student/presentDays/${classNumber}/${startDate}/${endDate}`
        );
        console.log(responseData);
        const sortedStudents = responseData.students.sort((a, b) =>
          a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })
        );
        console.log(sortedStudents);

        setStudents(sortedStudents);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStudents();
  }, [classNumber, sendRequest]);

  return (
    <div className="performance-page">
      <h1 className="performance-page-title">Attendance Report</h1>
      <table className="performance-table">
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>

            <th>Present days</th>
            <th>Total Working days</th>
            <th>Pecentage</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.rollNumber}</td>
              <td>{student.studentName}</td>

              <td>{student.presentDays}</td>
              <td>{student.totalDays}</td>
              <td>{(student.presentDays / student.totalDays) * 100}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceReport;
