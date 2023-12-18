import React, { useEffect, useState } from "react";
import { Card, Avatar, List, Modal } from "antd";
import "./About.css";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";

const { Meta } = Card;

const About = () => {
  //const [facultyData, setFacultyData] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCardClick = (faculty) => {
    setSelectedFaculty(faculty);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedFaculty(null);
    setIsModalVisible(false);
  };

  const [loadedDetails, setLoadedDetails] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/joshua/authentication/teacher/get/allteachers"
        );
        setLoadedDetails(responseData.teachers);
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
          <LoadingSpinner />
        </center>
      </div>
    ); // Add a loading state or spinner while data is being fetched
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Display error message if fetch request fails
  }

  return (
    <div className="faculty-directory-container">
      <center>
        <h1>&nbsp; Faculty Directory &nbsp;</h1>
      </center>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        dataSource={loadedDetails}
        renderItem={(faculty) => (
          <List.Item>
            <Card
              onClick={() => handleCardClick(faculty)}
              className="faculty-card"
            >
              <Meta
                avatar={
                  <Avatar
                    src={`${process.env.REACT_APP_ASSET_URL}/${faculty.image}`}
                    size={120}
                  />
                }
                title={
                  <span
                    style={{
                      fontFamily: "Courier New, monospace",
                      fontSize: "1.5rem",
                    }}
                  >
                    {faculty.name}
                  </span>
                }
                description={
                  <span
                    style={{
                      fontFamily: "Courier New, monospace",
                      fontSize: "1rem",
                    }}
                  >
                    {faculty.qualification}
                  </span>
                }
              />
            </Card>
          </List.Item>
        )}
      />
      <Modal
        visible={isModalVisible}
        title={
          selectedFaculty && (
            <span
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: "1.8rem",
              }}
            >
              {selectedFaculty.name}
            </span>
          )
        }
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedFaculty && (
          <div className="faculty-modal-content">
            <Avatar
              src={`${process.env.REACT_APP_ASSET_URL}/${selectedFaculty.image}`}
              size={120}
              style={{
                borderRadius: "50%", // Make it circular
                margin: "0 auto", // Center the avatar
                boxShadow: "rgb(38, 57, 77) 10px 30px 50px -15px",
              }}
            />
            <h2
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: "1.5rem",
              }}
            >
              {selectedFaculty.qualification}
            </h2>
            <p
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: "1.2rem",
              }}
            >
              {selectedFaculty.subjects}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default About;
