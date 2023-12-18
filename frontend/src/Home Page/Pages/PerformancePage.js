import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import "./PerformancePage.css"; // Import the CSS file

const PerformancePage = () => {
  const [students, setStudents] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { classNumber } = useParams();
  const { examName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log(examName);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/grading/getByClass/${classNumber}/${examName}`
        );
        const sortedStudents = responseData.grades.sort((a, b) =>
          a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })
        );

        setStudents(sortedStudents);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStudents();
  }, [classNumber, sendRequest]);

  // Extract the subjects from the first student (assuming all students have the same subjects)
  const subjects =
    students.length > 0
      ? students[0].subjects.map((subject) => subject.subjectName)
      : [];

  return (
    <div className="performance-page">
      <h1 className="performance-page-title">Student Performance</h1>
      <table className="performance-table">
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            {subjects.map((subject, index) => (
              <th key={index}>{subject}</th>
            ))}
            <th>Total Marks</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.rollNumber}</td>
              <td>{student.studentName}</td>
              {subjects.map((subject, subIndex) => (
                <td key={subIndex}>
                  {student.subjects.find((s) => s.subjectName === subject)
                    ?.marksObtained || 0}
                </td>
              ))}
              <td>{student.totalMarks}</td>
              <td>{student.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformancePage;
