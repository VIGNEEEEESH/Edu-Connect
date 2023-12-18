import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import "./MissViss.css"; // Import the CSS file

function Missviss() {
  const [loadedDetails, setLoadedDetails] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +  "/joshua/details"
        );
        setLoadedDetails(responseData.details[0]);
      } catch (err) {
        // Handle error
      }
    };

    fetchDetails();
  }, [sendRequest]);

  if (isLoading || !loadedDetails) {
    return (
      <center>
        <LoadingSpinner />
      </center>
    ); // Add a loading state or spinner while data is being fetched
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Display error message if fetch request fails
  }

  const { mission, vision } = loadedDetails;

  return (
    <div>
      <Carousel autoplay>
        <div className="carousel-slide">
          <h2>Mission </h2>
          <h3>{mission}</h3>
        </div>
        <div className="carousel-slide">
          <h2>Vision</h2>
          <h3>{vision}</h3>
        </div>
      </Carousel>
    </div>
  );
}

export default Missviss;
