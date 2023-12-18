import React, { useContext, useEffect, useState } from "react";
import "./AddStudent.css";
import { message, notification, Select } from "antd";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { useForm } from "../../Shared/Hooks/form-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import { VALIDATOR_REQUIRE } from "../../Shared/util/validators";
import { AuthContext } from "../../Shared/Context/Auth-context";
import { Option } from "antd/es/mentions";

function AddStudent() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      studentName: {
        value: "",
        isValid: false,
      },
      fatherName: {
        value: "",
        isValid: false,
      },
      motherName: {
        value: "",
        isValid: false,
      },
      classNumber: {
        value: "",
        isValid: false,
      },
      caste: {
        value: "",
        isValid: false,
      },
      progress: {
        value: "",
        isValid: false,
      },
      motherTongue: {
        value: "",
        isValid: false,
      },
      bloodGroup: {
        value: "",
        isValid: false,
      },
      fatherNumber: {
        value: "",
        isValid: false,
      },
      motherNumber: {
        value: "",
        isValid: false,
      },
      fatherOccupation: {
        value: "",
        isValid: false,
      },
      motherOccupation: {
        value: "",
        isValid: false,
      },
      rollNumber: {
        value: "",
        isValid: false,
      },
      studentId: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [classOptions, setClassOptions] = useState([]); // State to store the class options for the dropdown

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
        console.log(classNumbersArray);
      } catch (err) {}
    };

    fetchClassNumbers();
  }, [sendRequest]);

  const studentSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const requestData = {
        studentName: formState.inputs.studentName.value,
        fatherName: formState.inputs.fatherName.value,
        motherName: formState.inputs.motherName.value,
        classNumber: formState.inputs.classNumber.value,
        caste: formState.inputs.caste.value,
        progress: formState.inputs.progress.value,
        motherTongue: formState.inputs.motherTongue.value,
        bloodGroup: formState.inputs.bloodGroup.value,
        fatherNumber: formState.inputs.fatherNumber.value,
        motherNumber: formState.inputs.motherNumber.value,
        fatherOccupation: formState.inputs.fatherOccupation.value,
        motherOccupation: formState.inputs.motherOccupation.value,
        rollNumber: formState.inputs.rollNumber.value,
        studentId: formState.inputs.studentId.value,
      };
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/students/addStudent",
        "POST",
        JSON.stringify(requestData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      message.success("Student added successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className="AddStudent">
        {isLoading && <LoadingSpinner asOverlay />}

        <center>
          <div className="rectangle">
            <form onSubmit={studentSubmitHandler}>
              <h1>Student Form</h1>
              <div className="form-group">
                <Input
                  id="studentName"
                  element="input"
                  type="text"
                  label="Student Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid name"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="fatherName"
                  element="input"
                  type="text"
                  label="Father Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid father name"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="motherName"
                  element="input"
                  type="text"
                  label="Mother Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid mother name"
                  onInput={inputHandler}
                />
              </div>
              Class
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
                  style={{ width: "100px" }}
                >
                  {classOptions.map((classOption) => (
                    <Option key={classOption} value={classOption}>
                      {classOption}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="form-group">
                <Input
                  id="caste"
                  element="input"
                  type="text"
                  label="Caste"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid caste of the student"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="progress"
                  element="input"
                  type="text"
                  label="Progress"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid progress of the student"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="motherTongue"
                  element="input"
                  type="text"
                  label="Mother Tongue"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid motherTongue"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="bloodGroup"
                  element="input"
                  type="text"
                  label="Blood Group"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid bloodGroup"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="fatherNumber"
                  element="input"
                  type="text"
                  label="Father Number"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid father's number"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="motherNumber"
                  element="input"
                  type="text"
                  label="Mother Number"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid mother's number"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="fatherOccupation"
                  element="input"
                  type="text"
                  label="Father Occupation"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter the valid occupation of the father"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="motherOccupation"
                  element="input"
                  type="text"
                  label="Mother Occupation"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid occupation of the mother"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="rollNumber"
                  element="input"
                  type="text"
                  label="Roll Number"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid roll number"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="studentId"
                  element="input"
                  type="text"
                  label="Student Id"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid student id"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Button
                  type="submit"
                  className="submit-btn"
                  disabled={!formState.isValid}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </center>
      </div>
    </React.Fragment>
  );
}

export default AddStudent;
