import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Select } from "antd";
import "./PerformanceClass.css";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useForm } from "../../Shared/Hooks/form-hook";
import {
  VALIDATOR_DATE,
  VALIDATOR_REQUIRE,
} from "../../Shared/util/validators";
import Input from "../../Shared/Components/FormElements/Input";

const { Option } = Select;

const AttendanceReportClass = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      classNumber: {
        value: "",
        isValid: false,
      },
      startDate: {
        value: "",
        isValid: false,
      },
      endDate: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [classOptions, setClassOptions] = useState([]);
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

  const materialSubmitHandler = async (event) => {
    event.preventDefault();

    navigate(
      `/AttendanceReport/${formState.inputs.classNumber.value}/${formState.inputs.startDate.value}/${formState.inputs.endDate.value}`
    );
  };

  return (
    <div className="performanceclass">
      <div className="card-container">
        <Card className="dropdown-card" hoverable>
          <form onSubmit={materialSubmitHandler}>
            <center>
              <h1>Attendance Report</h1>
            </center>

            <div className="header-container">
              <h2>Select Class:</h2>
            </div>
            <div className="form-group">
              <Select
                id="classNumber"
                label="Class"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid class number of the student"
                onInput={inputHandler}
                value={formState.inputs.classNumber.value}
                onChange={(value) => inputHandler("classNumber", value, true)}
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
            <br />

            <div className="form-group">
              <Input
                id="startDate"
                element="input"
                type="date"
                label="Start Date"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_DATE()]}
                errorText="Please enter a valid date (YYYY-MM-DD)"
                onInput={inputHandler}
              />
            </div>
            <br />
            <div className="form-group">
              <Input
                id="endDate"
                element="input"
                type="date"
                label="End Date"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_DATE()]}
                errorText="Please enter a valid date (YYYY-MM-DD)"
                onInput={inputHandler}
              />
            </div>
            <br />
            <div className="submit-button-container">
              <button type="submit" id="submit" disabled={!formState.isValid}>
                Submit
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceReportClass;
