import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import "./Box.css";
import image1 from "./images/awards.png";
import image2 from "./images/classes.png";
import image3 from "./images/students.png";

const Box = () => {
  const [loadedDetails, setLoadedDetails] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const responseData = await sendRequest(
         process.env.REACT_APP_BACKEND_URL + `/joshua/details`
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
      <div>
        <center>
          
        </center>
      </div>
    ); // Add a loading state or spinner while data is being fetched
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Display error message if fetch request fails
  }

  const { classes, awards, studentNumber } = loadedDetails;

  return (
    <div className="Box">
      <div className="card-row">
        <div className="card">
          <center>
            <div className="card-body">
              <div className="image">
                <img src={image1} height="200px" alt="Image 1" />
              </div>
              <div>
                <h4>{awards} Awards</h4>
              </div>
            </div>
          </center>
        </div>
        <div className="card">
          <center>
            <div className="card-body">
              <div className="image">
                <img src={image2} height="200px" alt="Image 2" />
              </div>
              <div>
                <h4>{classes} classes</h4>
              </div>
            </div>
          </center>
        </div>
        <div className="card">
          <center>
            <div className="card-body">
              <div className="image">
                <img src={image3} height="200px" alt="Image 3" />
              </div>
              <div>
                <h4>
                  {studentNumber} <br /> Current students
                </h4>
              </div>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Box;
