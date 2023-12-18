import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import { message, Modal } from "antd";
import "./DeleteEvent.css";
import { AuthContext } from "../../Shared/Context/Auth-context";
import SearchBar from "../Components/SearchBar";

const DeleteEvent = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [loadedEvents, setLoadedEvents] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/event/get"
        );
        setLoadedEvents(responseData.events);
      } catch (err) {}
    };
    fetchEvents();
  }, [sendRequest]);

  const deleteEvents = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/event/delete/${eventToDelete._id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      setLoadedEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventToDelete._id)
      );
      closeModal();
      message.success("Event deleted successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };

  const openModal = (event) => {
    setEventToDelete(event);
    setIsDeleteModalVisible(true);
  };

  const closeModal = () => {
    setIsDeleteModalVisible(false);
    setEventToDelete(null);
  };
  const filteredEvents = loadedEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.time.toLowerCase().includes(searchTerm.toLowerCase())
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
      {!isLoading && loadedEvents && (
        <div className="deleteEvent-list">
          {filteredEvents.map((event) => (
            <div className="deleteEvent-card" key={event._id}>
              <h2>{event.title}</h2>
              <h2>{event.description}</h2>
              <h2>{event.date}</h2>
              <h2>{event.time}</h2>

              <button onClick={() => openModal(event)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <Modal
        visible={isDeleteModalVisible}
        onCancel={closeModal}
        onOk={deleteEvents}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this event?</p>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteEvent;
