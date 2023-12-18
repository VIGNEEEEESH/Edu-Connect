import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import "./GEEvent.css"; // Import the CSS file for component styles
import Avatar from "../../Shared/Components/UIElements/Avatar";
import SearchBar from "../Components/SearchBar";

const ViewEvent = () => {
  const [loadedEvents, setLoadedEvents] = useState([]);
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
        <div className="event-list">
          {filteredEvents.map((event) => (
            <div className="event-card" key={event._id}>
              <h2>title: {event.title}</h2>
              <h2>description: {event.description}</h2>
              <h2>date: {event.date}</h2>
              <h2>time: {event.time}</h2>
            </div>
          ))}
        </div>
      )}
    </React.Fragment>
  );
};

export default ViewEvent;
