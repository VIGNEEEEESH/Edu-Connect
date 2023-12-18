import React, { useContext, useEffect, useState } from "react";
import "./EditAdmission.css";
import { message, notification } from "antd";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useNavigate, useParams } from "react-router-dom";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { useForm } from "../../Shared/Hooks/form-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/util/validators";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import Card from "../../Shared/Components/UIElements/Card";
import { AuthContext } from "../../Shared/Context/Auth-context";

function EditAdmission() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedAdmission, setLoadedAdmission] = useState();
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
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

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/admission/get/id/${id}`
        );
        setLoadedAdmission(responseData.admissions);
        setFormData(
          {
            studentName: {
              value: responseData.admission.studentName,
              isValid: true,
            },
            fatherName: {
              value: responseData.admissiom.fatherName,
              isValid: true,
            },
            motherName: {
              value: responseData.admission.motherName,
              isValid: true,
            },
            classNumber: {
              value: responseData.admission.classNumber,
              isValid: true,
            },

            progress: {
              value: responseData.admission.progress,
              isValid: true,
            },

            fatherNumber: {
              value: responseData.admission.fatherNumber,
              isValid: true,
            },
            motherNumber: {
              value: responseData.admission.motherNumber,
              isValid: true,
            },
            fatherQualification: {
              value: responseData.admission.fatherQualification,
              isValid: true,
            },
            motherQualification: {
              value: responseData.admission.motherQualification,
              isValid: true,
            },
            previousSchool: {
              value: responseData.admission.previousSchool,
              isValid: true,
            },
            studentRemarks: {
              value: responseData.admission.studentRemarks,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchAdmission();
  }, [sendRequest, id, setFormData, inputHandler]);

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
        process.env.REACT_APP_BACKEND_URL + `/admission/update/${id}`,
        "PATCH",
        JSON.stringify(requestData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      message.success("Admission edited successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };
  if (isLoading || !loadedAdmission) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="center">
        <Card>
          <h2>The Admission is not identified</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedAdmission && (
        <div className="EditAdmission">
          {isLoading && <LoadingSpinner asOverlay />}

          <center>
            <div className="rectangle">
              <form onSubmit={admissionSubmitHandler}>
                <h1>Form</h1>

                <div className="form-group">
                  <Input
                    id="studentName"
                    element="input"
                    type="text"
                    label="Student Name"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid name"
                    onInput={inputHandler}
                    initialValue={loadedAdmission.studentName}
                    initialValid={true}
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
                    initialValue={loadedAdmission.fatherName}
                    initialValid={true}
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
                    initialValue={loadedAdmission.motherName}
                    initialValid={true}
                  />
                </div>
                <div className="form-group">
                  <Input
                    id="classNumber"
                    element="input"
                    type="text"
                    label="Class"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid class number of the student"
                    onInput={inputHandler}
                    initialValue={loadedAdmission.classNumber}
                    initialValid={true}
                  />
                </div>

                <div className="form-group">
                  <Input
                    id="progress"
                    element="input"
                    type="text"
                    label="Progress"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid progress"
                    onInput={inputHandler}
                    initialValue={loadedAdmission.progress}
                    initialValid={true}
                  />
                </div>

                <div className="form-group">
                  <Input
                    id="fatherNumber"
                    element="input"
                    type="text"
                    label="Father Number"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid name of the father"
                    onInput={inputHandler}
                    initialValue={loadedAdmission.fatherNumber}
                    initialValid={true}
                  />
                </div>
                <div className="form-group">
                  <Input
                    id="motherNumber"
                    element="input"
                    type="text"
                    label="Mother Number"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid name of the mother"
                    onInput={inputHandler}
                    initialValue={loadedAdmission.motherNumber}
                    initialValid={true}
                  />
                </div>
                <div className="form-group">
                  <Input
                    id="fatherQualification"
                    element="input"
                    type="text"
                    label="Father Qaulification"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid qualification of the father"
                    onInput={inputHandler}
                    initialValue={loadedAdmission.fatherQualification}
                    initialValid={true}
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
                    initialValue={loadedAdmission.motherQualification}
                    initialValid={true}
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
                    initialValue={loadedAdmission.previousSchool}
                    initialValid={true}
                  />
                </div>
                <div className="form-group">
                  <Input
                    id="studentRemarks"
                    element="input"
                    type="text"
                    label="Student Rearks"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid remarks of the student"
                    onInput={inputHandler}
                    initialValue={loadedAdmission.studentRemarks}
                    initialValid={true}
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
      )}
    </React.Fragment>
  );
}

export default EditAdmission;
