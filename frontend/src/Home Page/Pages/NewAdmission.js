import React from "react";
import "./AddAdmission.css";
import { message, notification } from "antd";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { useForm } from "../../Shared/Hooks/form-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import { VALIDATOR_REQUIRE } from "../../Shared/util/validators";

function NewAdmission() {
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

      progress: {
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
      fatherQualification: {
        value: "",
        isValid: false,
      },
      motherQualification: {
        value: "",
        isValid: false,
      },
      previousSchool: {
        value: "",
        isValid: false,
      },
      studentRemarks: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();
  const admissionSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const requestData = {
        studentName: formState.inputs.studentName.value,
        fatherName: formState.inputs.fatherName.value,
        motherName: formState.inputs.motherName.value,
        classNumber: formState.inputs.classNumber.value,
        progress: formState.inputs.progress.value,
        fatherNumber: formState.inputs.fatherNumber.value,
        motherNumber: formState.inputs.motherNumber.value,
        fatherQualification: formState.inputs.fatherQualification.value,
        motherQualification: formState.inputs.motherQualification.value,
        previousSchool: formState.inputs.previousSchool.value,
        studentRemarks: formState.inputs.studentRemarks.value,
      };
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/admission/add",
        "POST",
        JSON.stringify(requestData),
        {
          "Content-Type": "application/json",
        }
      );
      message.success("Admission added successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className="AddAdmission">
        {isLoading && <LoadingSpinner asOverlay />}

        <center>
          <div className="rectangle">
            <form onSubmit={admissionSubmitHandler}>
              <h1>Admission Form</h1>
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
                  errorText="Please enter a valid name of the father"
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
                  errorText="Please enter a valid name of the mother"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="classNumber"
                  element="input"
                  type="text"
                  label="Class"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid class number"
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
                  id="fatherNumber"
                  element="input"
                  type="text"
                  label="Father Number"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid number of the father"
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
                  errorText="Please enter a valid number of the mother"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="fatherQualification"
                  element="input"
                  type="text"
                  label="Father Qualification"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid qualification of the father"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="motherQualification"
                  element="input"
                  type="text"
                  label="Mother Qualification"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid qualification of the mother"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="previousSchool"
                  element="input"
                  type="text"
                  label="Previous School"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid name of the previous school"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="studentRemarks"
                  element="input"
                  type="text"
                  label="Student Remarks"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid remarks of the student"
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

export default NewAdmission;
