import React from "react";
import "./Admissionbar.css";

function Admissionbar() {
  const handleClick = () => {
    window.location.href = "/Admission";
  };

  return (
    <div className="admissions-open-bar" onClick={handleClick}>
      <span className="admissions-open-text">Admissions Open</span>
    </div>
  );
}

export default Admissionbar;
