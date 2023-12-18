import React from "react";
import { Button } from "antd";
import "./AttendMarks.css";

const AttendMarks = () => {
  return (
    <div className="attendmarks">
      <div className="page-container">
        <div className="button-container">
          <Button className="attendance-button" type="primary">
            Attendance
          </Button>
          <Button className="marks-button" type="primary">
            Marks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendMarks;
