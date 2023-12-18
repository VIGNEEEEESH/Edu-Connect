import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import "./GEStudent.css"; // Import the CSS file for component styles
import { Link } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
const GEStudent = () => {
  const [loadedStudents, setLoadedStudents] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/students/allStudents"
        );
        setLoadedStudents(responseData.students);
      } catch (err) {}
    };
    fetchStudents();
  }, [sendRequest]);
  const filteredStudents = loadedStudents.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.classNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fatherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.motherNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <React.Fragment>
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <br />
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedStudents && (
        <div className="student-list">
          {filteredStudents.map((student) => (
            <Link to={`/EditStudent/${student._id}`} key={student._id}>
              <div className="student-card" key={student._id}>
                <h4>Name: {student.studentName}</h4>
                <h4>Class: {student.classNumber}</h4>
                <h4>Father Name: {student.fatherName}</h4>
                <h4>Mother Name: {student.motherName}</h4>
                <h4>Roll Number: {student.rollNumber}</h4>
              </div>
            </Link>
          ))}
        </div>
      )}
    </React.Fragment>
  );
};

export default GEStudent;
