import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, Select, Button } from "antd";
import "./Student.css";

const { Option } = Select;
const Student = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const navigate = useNavigate();

  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
  };

  const handleSubmit = () => {
    navigate("/AttendMarks");
  };

  return (
    <div className="student">
      <div className="card-container">
        <Card className="dropdown-card" hoverable>
          <div className="header-container">
            <h2>Select Class:</h2>
            <h2>Select Subject:</h2>
          </div>
          <div className="dropdown-container">
            <Select
              value={selectedClass}
              onChange={handleClassChange}
              placeholder="Select Class"
              className="dropdown"
              dropdownStyle={{ top: "auto", bottom: 40 }} // Set dropdownStyle for the first Select component
            >
              <Option value="class1">Class 1</Option>
              <Option value="class2">Class 2</Option>
              <Option value="class3">Class 3</Option>
              <Option value="class4">Class 4</Option>
              <Option value="class5">Class 5</Option>
              <Option value="class6">Class 6</Option>
              <Option value="class7">Class 7</Option>
              <Option value="class8">Class 8</Option>
              <Option value="class9">Class 9</Option>
              <Option value="class10">Class 10</Option>
            </Select>
            <Select
              value={selectedSubject}
              onChange={handleSubjectChange}
              placeholder="Select Subject"
              className="dropdown"
            >
              <Option value="maths">Maths</Option>
              <Option value="science">Science</Option>
              <Option value="english">English</Option>
              <Option value="social">Social</Option>
              <Option value="hindi">Hindi</Option>
              <Option value="telugu">Telugu</Option>
            </Select>
          </div>
          <div className="submit-button-container">
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Student;
