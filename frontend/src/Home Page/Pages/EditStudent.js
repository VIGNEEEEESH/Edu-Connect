import React, { useContext, useEffect, useState } from "react";
import "./EditStudent.css";
import { message, notification, Select } from "antd";
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
import { Option } from "antd/es/mentions";

function EditStudent() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedStudent, setLoadedStudent] = useState();

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
      caste: {
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
    },
    false
  );
  const [classOptions, setClassOptions] = useState([]); 

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
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/students/Id/${id}`
        );
        setLoadedStudent(responseData.student);
        setFormData(
          {
            studentName: {
              value: responseData.students.studentName,
              isValid: true,
            },
            fatherName: {
              value: responseData.students.fatherName,
              isValid: true,
            },
            motherName: {
              value: responseData.students.motherName,
              isValid: true,
            },
            classNumber: {
              value: "",
              isValid: true,
            },

            progress: {
              value: responseData.students.progress,
              isValid: true,
            },
            caste: {
              value: responseData.students.caste,
              isValid: true,
            },
            motherTongue: {
              value: responseData.students.motherTongue,
              isValid: true,
            },
            bloodGroup: {
              value: responseData.students.bloodGroup,
              isValid: true,
            },

            fatherNumber: {
              value: responseData.students.fatherNumber,
              isValid: true,
            },
            motherNumber: {
              value: responseData.students.motherNumber,
              isValid: true,
            },
            fatherOccupation: {
              value: responseData.students.fatherOccupation,
              isValid: true,
            },
            motherOccupation: {
              value: responseData.students.motherOccupation,
              isValid: true,
            },
            rollNumber: {
              value: responseData.students.rollNumber,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchStudent();
  }, [sendRequest, id, setFormData, inputHandler]);

  const studentSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const requestData = {
        studentName: formState.inputs.studentName.value,
        fatherName: formState.inputs.fatherName.value,
        motherName: formState.inputs.motherName.value,
        classNumber: formState.inputs.classNumber.value,
        progress: formState.inputs.progress.value,
        caste: formState.inputs.caste.value,
        motherTongue: formState.inputs.motherTongue.value,
        bloodGroup: formState.inputs.bloodGroup.value,
        fatherNumber: formState.inputs.fatherNumber.value,
        motherNumber: formState.inputs.motherNumber.value,
        fatherOccupation: formState.inputs.fatherOccupation.value,
        motherOccupation: formState.inputs.motherOccupation.value,
        rollNumber: formState.inputs.rollNumber.value,
      };

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/students/update/${id}`,
        "PATCH",
        JSON.stringify(requestData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      message.success("Student edited successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!loadedStudent && !error) {
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
      {!isLoading && loadedStudent && (
        <div className="EditStudent">
          {isLoading && <LoadingSpinner asOverlay />}

          <center>
            <div className="rectangle">
              <form onSubmit={studentSubmitHandler}>
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
                    initialValue={loadedStudent.studentName}
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
                    errorText="Please enter a valid name of the father"
                    onInput={inputHandler}
                    initialValue={loadedStudent.fatherName}
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
                    errorText="Please enter a valid name of the mother"
                    onInput={inputHandler}
                    initialValue={loadedStudent.motherName}
                    initialValid={true}
                  />
                </div>
                <div className="form-group">
                  <Select
                    id="classNumber"
                    label="Class"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid class number of the student"
                    onInput={inputHandler}
                    value={formState.inputs.classNumber.value}
                    onChange={(value) =>
                      inputHandler("classNumber", value, true)
                    }
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
                    initialValue={loadedStudent.caste}
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
                    errorText="Please enter a valid progress of the student"
                    onInput={inputHandler}
                    initialValue={loadedStudent.progress}
                    initialValid={true}
                  />
                </div>
                <div className="form-group">
                  <Input
                    id="motherTongue"
                    element="input"
                    type="text"
                    label="Mother Tongue"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid motherTongue of the student"
                    onInput={inputHandler}
                    initialValue={loadedStudent.motherTongue}
                    initialValid={true}
                  />
                </div>
                <div className="form-group">
                  <Input
                    id="bloodGroup"
                    element="input"
                    type="text"
                    label="Blood Group"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid blood group of the student"
                    onInput={inputHandler}
                    initialValue={loadedStudent.bloodGroup}
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
                    errorText="Please enter a valid number of the father"
                    onInput={inputHandler}
                    initialValue={loadedStudent.fatherNumber}
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
                    errorText="Please enter a valid number of the mother"
                    onInput={inputHandler}
                    initialValue={loadedStudent.motherNumber}
                    initialValid={true}
                  />
                </div>
                <div className="form-group">
                  <Input
                    id="fatherOccupation"
                    element="input"
                    type="text"
                    label="Father Occupation"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid occupation of the father"
                    onInput={inputHandler}
                    initialValue={loadedStudent.fatherOccupation}
                    initialValid={true}
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
                    initialValue={loadedStudent.motherOccupation}
                    initialValid={true}
                  />
                </div>
                <div className="form-group">
                  <Input
                    id="rollNumber"
                    element="input"
                    type="text"
                    label="Roll Number"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid roll number of the student"
                    onInput={inputHandler}
                    initialValue={loadedStudent.rollNumber}
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

export default EditStudent;
