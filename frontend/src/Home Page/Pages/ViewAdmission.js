import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import "./GEAdmission.css"; // Import the CSS file for component styles
import SearchBar from "../Components/SearchBar";

const ViewAdmission = () => {
  const [loadedAdmissions, setLoadedAdmissions] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/admission/get"
        );
        setLoadedAdmissions(responseData.admissions);
      } catch (err) {}
    };
    fetchAdmissions();
  }, [sendRequest]);
  console.log(loadedAdmissions);
  const filteredAdmissions = loadedAdmissions.filter(
    (admissions) =>
      admissions.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admissions.classNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admissions.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admissions.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admissions.fatherNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      admissions.motherNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <React.Fragment>
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <br/>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedAdmissions && (
        <div className="admission-list">
          {filteredAdmissions.map((admission) => (
            <div className="admission-card">
              <h2>Student name: {admission.studentName}</h2>
              <h2>Father name: {admission.fatherName}</h2>
              <h2>Mother name: {admission.motherName}</h2>
              <h2>Father number: {admission.fatherNumber}</h2>
            </div>
          ))}
        </div>
      )}
    </React.Fragment>
  );
};

export default ViewAdmission;
