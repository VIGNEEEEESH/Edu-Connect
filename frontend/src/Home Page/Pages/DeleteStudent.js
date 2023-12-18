import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import { message, Modal } from "antd";
import "./DeleteStudent.css";
import { AuthContext } from "../../Shared/Context/Auth-context";
import SearchBar from "../Components/SearchBar";

const DeleteStudent = () => {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  const [loadedStudents, setLoadedStudents] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
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
  const deleteStudent = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/students/delete/${studentToDelete._id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      setLoadedStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentToDelete._id)
      );
      closeModal();
      message.success("Student deleted successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };

  const openModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalVisible(true);
  };

  const closeModal = () => {
    setIsDeleteModalVisible(false);
    setStudentToDelete(null);
  };

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
        <div className="deleteStudent-list">
          {filteredStudents.map((student) => (
            <div className="deleteStudent-card" key={student._id}>
              <h2>{student.studentName}</h2>
              <h2>{student.classNumber}</h2>
              <h2>{student.fatherName}</h2>
              <h2>{student.motherName}</h2>
              <h2>{student.rollNumber}</h2>

              <button onClick={() => openModal(student)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <Modal
        visible={isDeleteModalVisible}
        onCancel={closeModal}
        onOk={deleteStudent}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this student?</p>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteStudent;
