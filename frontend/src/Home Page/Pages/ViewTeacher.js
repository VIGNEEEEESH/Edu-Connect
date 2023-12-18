import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import "./GETeacher.css"; // Import the CSS file for component styles
import Avatar from "../../Shared/Components/UIElements/Avatar";
import SearchBar from "../Components/SearchBar";

const ViewTeacher = () => {
  const [loadedTeachers, setLoadedTeachers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/joshua/authentication/teacher/get/allteachers"
        );
        setLoadedTeachers(responseData.teachers);
      } catch (err) {}
    };
    fetchTeachers();
  }, [sendRequest]);

  const filteredTeachers = loadedTeachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <React.Fragment>
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedTeachers && (
        <div className="teacher-list">
          {filteredTeachers.map((teacher) => (
            <div className="teacher-card">
              <Avatar
                image={`${process.env.REACT_APP_ASSET_URL}/${teacher.image}`}
                alt={teacher.name}
              />
              <h2>{teacher.name}</h2>
              <h2>{teacher.email}</h2>
              <p>{teacher.subjects}</p>
            </div>
          ))}
        </div>
      )}
    </React.Fragment>
  );
};

export default ViewTeacher;
