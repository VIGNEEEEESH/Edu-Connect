import React, { useContext, useEffect, useState } from "react";
import "./EditTeacher.css";
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

function EditTeacher() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const { email } = useParams();
  const [loadedTeacher, setLoadedTeacher] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
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

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/joshua/authentication/teacher/get/${email}`
        );
        setLoadedTeacher(responseData.teacher);
        setFormData(
          {
            name: {
              value: responseData.teacher.name,
              isValid: true,
            },
            password: {
              value: responseData.teacher.password,
              isValid: true,
            },
            image: {
              value: null,
              isValid: true,
            },
            qualification: {
              value: responseData.teacher.qualification,
              isValid: true,
            },
            subjects: {
              value: responseData.teacher.subjects,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchTeacher();
  }, [sendRequest, email, setFormData, inputHandler]);

  const teacherSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("qualification", formState.inputs.qualification.value);
      formData.append("subjects", formState.inputs.subjects.value);

      if (formState.inputs.image.value) {
        formData.append("image", formState.inputs.image.value);
      }

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/joshua/authentication/teacher/update/${email}`,
        "PATCH",
        formData,
        { Authorization: "Bearer " + auth.token }
      );
      message.success("Teacher edited successfully");

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
  if (!loadedTeacher && !error) {
    return (
      <div className="center">
        <Card>
          <h2>The Teacher is not identified</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedTeacher && (
        <div className="EditTeacher">
          {isLoading && <LoadingSpinner asOverlay />}

          <center>
            <div className="rectangle">
              <form onSubmit={teacherSubmitHandler}>
                <h1>Form</h1>
                <div className="form-group">
                  <Input
                    id="name"
                    element="input"
                    type="text"
                    label="Name"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid name"
                    onInput={inputHandler}
                    initialValue={loadedTeacher.name}
                    initialValid={true}
                  />
                </div>

                <div className="form-group">
                  <Input
                    id="password"
                    element="input"
                    type="text"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    errorText="Please enter a valid password"
                    onInput={inputHandler}
                    initialValue={loadedTeacher.password}
                    initialValid={true}
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
                    initialValue={loadedTeacher.qualification}
                    initialValid={true}
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
                    initialValue={loadedTeacher.subjects}
                    initialValid={true}
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
      )}
    </React.Fragment>
  );
}

export default EditTeacher;
