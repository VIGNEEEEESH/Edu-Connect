
import React, { useContext, useState } from "react";
import "./Signup.css";
import { message, notification } from "antd";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { useForm } from "../../Shared/Hooks/form-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/util/validators";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import { AuthContext } from "../../Shared/Context/Auth-context";

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
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);}
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className="signup">
        {isLoading && <LoadingSpinner asOverlay />}

        <center>
          <div className="rectangle">
            <form onSubmit={signupSubmitHandler}>
              <h1>Admin Sign-Up</h1>
              
              <div className="form-group">
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errortext="Please enter a valid name."
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
          type={showPassword ? "text" : "password"}
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password"
          onInput={inputHandler}
          icon={
            showPassword ? (
              <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
            ) : (
              <EyeOutlined onClick={togglePasswordVisibility} />
            )
          }
        />
              </div>
              <button
        type="button"
        className="login-button"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? "Hide" : "Show"} Password
      </button><br/>
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Please provide an image"
              /><br />
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

export default Signup;
