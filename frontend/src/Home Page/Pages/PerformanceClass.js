import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Select } from "antd";
import "./PerformanceClass.css";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useForm } from "../../Shared/Hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../Shared/util/validators";

const { Option } = Select;

const PerformanceClass = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      classNumber: {
        value: "",
        isValid: false,
      },
      examName: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [classOptions, setClassOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [classNumber, setClassNumber] = useState(""); // Add state for classNumber
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassNumbers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/joshua/details"
        );
        const classNumbersArray =
          responseData.details[0].classNumber[0].split(",");
        setClassOptions(classNumbersArray);
      } catch (err) {}
    };

    fetchClassNumbers();
  }, [sendRequest]);

  useEffect(() => {
    const fetchExamNames = async () => {
      try {
        console.log(classNumber);
        if (classNumber) {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/grading/getExams/${classNumber}`
          );
          const examNamesArray = responseData.examNames;
          setExamOptions(examNamesArray);
          console.log("examOptions:", examOptions);
        }
      } catch (err) {}
    };

    fetchExamNames();
  }, [sendRequest, classNumber]);

  const materialSubmitHandler = async (event) => {
    event.preventDefault();
    if (event) {
      console.log("event");
    }
    if (formState.inputs.examName.value) {
      navigate(
        `/Performance/${classNumber}/${formState.inputs.examName.value}`
      );
    }
  };

  return (
    <div className="performanceclass">
      <div className="card-container">
        <Card className="dropdown-card" hoverable>
          <form onSubmit={materialSubmitHandler}>
            <center>
              <h1>Performance</h1>
            </center>

            <div className="header-container">
              <h2>Select Class:</h2>
            </div>
            <div className="form-group">
              <Select
                id="classNumber"
                label="Class"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please select a valid class"
                onInput={inputHandler}
                value={classNumber} // Update the value prop to classNumber
                onChange={(value) => setClassNumber(value)} // Update the onChange event handler
                required
                style={{ width: "100%" }}
              >
                {classOptions.map((classOption) => (
                  <Option key={classOption} value={classOption}>
                    {classOption}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="header-container">
              <h2>Select Exam:</h2>
            </div>
            <div className="form-group">
              <Select
                id="examName"
                label="Exam"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please select a valid exam"
                onInput={inputHandler}
                value={formState.inputs.examName.value}
                onChange={(value) => inputHandler("examName", value, true)}
                required
                style={{ width: "100%" }}
              >
                {examOptions.map((examOption) => (
                  <Option key={examOption} value={examOption}>
                    {examOption}
                  </Option>
                ))}
              </Select>
            </div>
            <br />
            <div className="submit-button-container">
              <button
                type="submit"
                id="submit"
                disabled={!formState.inputs.examName.value}
              >
                Submit
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceClass;
