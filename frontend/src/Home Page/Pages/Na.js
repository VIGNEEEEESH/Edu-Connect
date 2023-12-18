import React, { useContext, useState } from "react";
import "./Signup.css";
import backgroundImage from "./signup.jpeg"; // Import the image file
import { AuthContext } from "../../Shared/Context/Auth-context";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useForm } from "../../Shared/Hooks/form-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import Input from "../../Shared/Components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/util/validators";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import Card from "../../Shared/Components/UIElements/Card";
import { Navigate, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";

const Signup = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
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
        value: null,
        isValid: false,
      },
    },
    false
  );

  const signupSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", formState.inputs.image.value);
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/joshua/authentication/admin/createadmin",
        "POST",
        formData
      );
      console.log(responseData);
      auth.login(responseData.userId, responseData.token);
      navigate("/admin");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSwitchToLogin = () => {
    navigate("/adminLogin");
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div
        className="signup"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="container">
          <h2>Signup </h2>
          <Card className="authentication">
            <form onSubmit={signupSubmitHandler}>
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errortext="Please enter a valid name."
                onInput={inputHandler}
              />
              <Input
                element="input"
                id="email"
                type="email"
                label="E-Mail"
                validators={[VALIDATOR_EMAIL()]}
                errortext="Please enter a valid email."
                onInput={inputHandler}
              />
              <Input
                element="input"
                id="password"
                type="password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errortext="Please enter a valid password."
                onInput={inputHandler}
              />
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Please provide an image"
              />

              <button type="submit" disabled={!formState.isValid}>
                Signup
              </button>
            </form>
            <button className="login-button" onClick={handleSwitchToLogin}>
              Switch to Log-in
            </button>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signup;


