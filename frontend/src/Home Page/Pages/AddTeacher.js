import React, { useContext, useState } from "react";
import "./AddTeacher.css";
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
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/util/validators";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import { AuthContext } from "../../Shared/Context/Auth-context";

function AddTeacher() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
      qualification: {
        value: "",
        isValid: false,
      },
      subjects: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();
  const teacherSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("qualification", formState.inputs.qualification.value);
      formData.append("subjects", formState.inputs.subjects.value); // Add subjects to form data
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/joshua/authentication/teacher/createteacher",
        "POST",
        formData, // Pass formData as the request body
        { Authorization: "Bearer " + auth.token }
      );
      message.success("Teacher added successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className="AddTeacher">
        {isLoading && <LoadingSpinner asOverlay />}

        <center>
          <div className="rectangle">
            <form onSubmit={teacherSubmitHandler}>
              <h1>Teacher Form</h1>
              <div className="form-group">
                <Input
                  id="name"
                  element="input"
                  type="text"
                  label="Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter a valid name"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="email"
                  element="input"
                  type="text"
                  label="E-mail"
                  validators={[VALIDATOR_EMAIL()]}
                  errorText="Please enter a valid email"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="password"
                  element="input"
                  type="password"
                  label="Password"
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter a valid password"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="qualification"
                  element="input"
                  type="text"
                  label="Qualification"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your qualification"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="subjects"
                  element="input"
                  type="text"
                  label="Subjects"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your subjects"
                  onInput={inputHandler}
                />
              </div>
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Please provide an image"
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

export default AddTeacher;
