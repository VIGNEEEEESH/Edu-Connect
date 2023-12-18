import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Select } from "antd";
import "./AttendanceClass.css";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useForm } from "../../Shared/Hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../Shared/util/validators";

const { Option } = Select;

const ViewStudyMaterialsClass = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      classNumber: {
        value: null,
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
    if (formState.inputs.classNumber.value) {
      const classNumber = encodeURIComponent(
        formState.inputs.classNumber.value
      );
      console.log(classNumber);
      navigate(`/ViewStudyMaterial/${classNumber}`);
    }
  };

  return (
    <div className="attendanceclass">
      <div className="card-container">
        <Card className="dropdown-card" hoverable>
          <form onSubmit={materialSubmitHandler}>
            <center>
              <h1>Study Material</h1>
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
            <div className="submit-button-container">
              <button
                type="submit"
                id="submit"
                disabled={!formState.inputs.classNumber.value}
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

export default ViewStudyMaterialsClass;
