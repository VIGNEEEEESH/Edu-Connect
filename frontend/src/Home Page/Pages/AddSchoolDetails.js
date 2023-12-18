import React, { useContext, useState } from "react";
import "./AddSchoolDetails.css";
import { message, notification } from "antd";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { useForm } from "../../Shared/Hooks/form-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/util/validators";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import { AuthContext } from "../../Shared/Context/Auth-context";

function AddSchoolDetails() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      schoolName: {
        value: "",
        isValid: false,
      },
      mission: {
        value: "",
        isValid: false,
      },
      vision: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      phoneNumber: {
        value: "",
        isValid: false,
      },
      mail: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      awards: {
        value: "",
        isValid: false,
      },
      classes: {
        value: "",
        isValid: false,
      },
      classNumber: {
        value: [],
        isValid: false,
      },
      studentNumber: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();
  const detailsSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("schoolName", formState.inputs.schoolName.value);
      formData.append("mission", formState.inputs.mission.value);
      formData.append("vision", formState.inputs.vision.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("phoneNumber", formState.inputs.phoneNumber.value);
      formData.append("mail", formState.inputs.mail.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("awards", formState.inputs.awards.value);
      formData.append("classes", formState.inputs.classes.value);
      formData.append("classNumber", formState.inputs.classNumber.value);
      formData.append("studentNumber", formState.inputs.studentNumber.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/joshua/details",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      message.success("Details added successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };
  const checkboxChangeHandler = (value) => {
    const updatedClassNumber = [...formState.inputs.classNumber.value];

    // If the selected class is already in the array, remove it; otherwise, add it
    if (updatedClassNumber.includes(value)) {
      const index = updatedClassNumber.indexOf(value);
      updatedClassNumber.splice(index, 1);
    } else {
      updatedClassNumber.push(value);
    }

    inputHandler("classNumber", updatedClassNumber, true);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className="AddSchoolDetails">
        {isLoading && <LoadingSpinner asOverlay />}

        <center>
          <div className="rectangle">
            <form onSubmit={detailsSubmitHandler}>
              <h1>Form</h1>
              <div className="form-group">
                <Input
                  id="schoolName"
                  element="input"
                  type="text"
                  label="School Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a school name"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="mission"
                  element="textarea"
                  label="Mission"
                  validators={[VALIDATOR_MINLENGTH(5)]}
                  errorText="Please enter a valid mission"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="vision"
                  element="textarea"
                  label="Vision"
                  validators={[VALIDATOR_MINLENGTH(5)]}
                  errorText="Please enter a valid vision"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="description"
                  element="textarea"
                  label="Description"
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter a valid description"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="phoneNumber"
                  element="input"
                  label="Phone Number"
                  type="text"
                  validators={[VALIDATOR_MINLENGTH(10),VALIDATOR_MAXLENGTH(10)]}
                  errorText="Please enter a valid phone number"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="mail"
                  element="input"
                  label="Mail"
                  type="text"
                  validators={[VALIDATOR_EMAIL()]}
                  errorText="Please enter a valid mail"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="address"
                  element="textarea"
                  label="address"
                  validators={[VALIDATOR_MINLENGTH(5)]}
                  errorText="Please enter a valid address"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="awards"
                  element="input"
                  type="text"
                  label="Awards"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a award number"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="classes"
                  element="input"
                  type="text"
                  label="Classes upto"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter  valid  classes that you provide"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <div className="checkbox-group">
                  <label className="checkbox-label">select classes:</label>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="Nursery"
                      value="Nursery"
                      checked={formState.inputs.classNumber.value.includes(
                        "Nursery"
                      )}
                      onChange={() => checkboxChangeHandler("Nursery")}
                    />
                    <label htmlFor="Nursery">Nursery</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="LKG_PP1"
                      value="LKG_PP1"
                      checked={formState.inputs.classNumber.value.includes(
                        "LKG_PP1"
                      )}
                      onChange={() => checkboxChangeHandler("LKG_PP1")}
                    />
                    <label htmlFor="LKG_PP1">LKG/PP1</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="UKG_PP2"
                      value="UKG_PP2"
                      checked={formState.inputs.classNumber.value.includes(
                        "UKG_PP2"
                      )}
                      onChange={() => checkboxChangeHandler("UKG_PP2")}
                    />
                    <label htmlFor="UKG_PP2">UKG/PP2</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class1"
                      value="Class_1"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_1"
                      )}
                      onChange={() => checkboxChangeHandler("Class_1")}
                    />
                    <label htmlFor="class1">Class 1</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class2"
                      value="Class_2"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_2"
                      )}
                      onChange={() => checkboxChangeHandler("Class_2")}
                    />
                    <label htmlFor="class2">Class 2</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class3"
                      value="Class_3"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_3"
                      )}
                      onChange={() => checkboxChangeHandler("Class_3")}
                    />
                    <label htmlFor="class3">Class 3</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class4"
                      value="Class_4"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_4"
                      )}
                      onChange={() => checkboxChangeHandler("Class_4")}
                    />
                    <label htmlFor="class4">Class 4</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class5"
                      value="Class_5"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_5"
                      )}
                      onChange={() => checkboxChangeHandler("Class_5")}
                    />
                    <label htmlFor="class5">Class 5</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class6"
                      value="Class_6"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_6"
                      )}
                      onChange={() => checkboxChangeHandler("Class_6")}
                    />
                    <label htmlFor="class6">Class 6</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class7"
                      value="Class_7"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_7"
                      )}
                      onChange={() => checkboxChangeHandler("Class_7")}
                    />
                    <label htmlFor="class7">Class 7</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class8"
                      value="Class_8"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_8"
                      )}
                      onChange={() => checkboxChangeHandler("Class_8")}
                    />
                    <label htmlFor="class8">Class 8</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class9"
                      value="Class_9"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_9"
                      )}
                      onChange={() => checkboxChangeHandler("Class_9")}
                    />
                    <label htmlFor="class9">Class 9</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class10"
                      value="Class_10"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_10"
                      )}
                      onChange={() => checkboxChangeHandler("Class_10")}
                    />
                    <label htmlFor="class10">Class 10</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class11"
                      value="Class_11"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_11"
                      )}
                      onChange={() => checkboxChangeHandler("Class_11")}
                    />
                    <label htmlFor="class11">Class 11</label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="class12"
                      value="Class_12"
                      checked={formState.inputs.classNumber.value.includes(
                        "Class_12"
                      )}
                      onChange={() => checkboxChangeHandler("Class_12")}
                    />
                    <label htmlFor="class12">Class 12</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <Input
                  id="studentNumber"
                  element="input"
                  type="text"
                  label="Total Student Number"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter number of  students who are present in your school "
                  onInput={inputHandler}
                />
              </div>
              <ImageUpload
                id="image"
                onInput={inputHandler}
                errorText="Please provide an logo"
              />
              <br />

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

export default AddSchoolDetails;
