import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "./EventGallery.css";
import { useHttpClient } from "../../Shared/Hooks/http-hook";

const EventGallery = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  const handleEventClick = (event) => {
    setActiveEvent(event);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setActiveEvent(null);
    setModalVisible(false);
  };
  const [events, setEvents] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +  `/event/get`
        );
        setEvents(responseData.events);
      } catch (err) {}
    };
    fetchEvents();
  }, [sendRequest]);

  return (
    <div className="event-gallery">
      <div className="event-container">
        <center>
          <h1 style={{ fontFamily: "'Courier New', monospace" }}>Events</h1>
        </center>
        {events.map((event) => (
          <div className="event-item" onClick={() => handleEventClick(event)}>
            <h2 className="event-title" style={{ fontFamily: "'Courier New', monospace" }}>
              {event.title}
            </h2>
            <div className="event-meta">
              <p className="event-date" style={{ fontFamily: "'Courier New', monospace" }}>
                {event.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        visible={modalVisible}
        title={activeEvent && <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", textDecoration: "underline" }}>{activeEvent.title}</span>}
        onCancel={handleModalClose}
        footer={null}
        id="modal"
      >
        {activeEvent && (
          <div>
            <b><p className="event-date" style={{ fontFamily: "'Courier New', monospace" }}>
              {activeEvent.date}
            </p></b>
            <b><p className="event-time" style={{ fontFamily: "'Courier New', monospace" }}>
              {activeEvent.time}
            </p></b>
            <b><p className="event-description" style={{ fontFamily: "'Courier New', monospace" }}>
              {activeEvent.description}
            </p></b>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventGallery;