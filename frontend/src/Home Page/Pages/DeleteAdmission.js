import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import { message, Modal } from "antd";
import "./DeleteEvent.css";
import { AuthContext } from "../../Shared/Context/Auth-context";
import SearchBar from "../Components/SearchBar";

const DeleteAdmission = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [loadedAdmissions, setLoadedAdmissions] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [admissionsToDelete, setAdmissionsToDelete] = useState(null);
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
  const deleteAdmissions = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/Admissions/delete/${admissionsToDelete._id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      setLoadedAdmissions((prevAdmissions) =>
        prevAdmissions.filter(
          (admissions) => admissions._id !== admissionsToDelete._id
        )
      );
      closeModal();
      message.success("Admissions deleted successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };

  const openModal = (admissions) => {
    setAdmissionsToDelete(admissions);
    setIsDeleteModalVisible(true);
  };

  const closeModal = () => {
    setIsDeleteModalVisible(false);
    setAdmissionsToDelete(null);
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
      {!isLoading && loadedAdmissions && (
        <div className="deleteEvent-list">
          {filteredAdmissions.map((admissions) => (
            <div className="deleteEvent-card" key={admissions._id}>
              <h2>Student name: {admissions.studentName}</h2>
              <h2>Father name: {admissions.fatherName}</h2>
              <h2>Mother name: {admissions.motherName}</h2>
              <h2>Father number: {admissions.fatherNumber}</h2>

              <button onClick={() => openModal(admissions)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <Modal
        visible={isDeleteModalVisible}
        onCancel={closeModal}
        onOk={deleteAdmissions}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this Admissions?</p>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteAdmission;
