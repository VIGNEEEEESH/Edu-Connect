
import React, { useContext, useState } from "react";
import "./Login.css";
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

const TeacherLogin = () => {
    const navigate = useNavigate();
  
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm(
      {
        email: {
          value: "",
          isValid: false,
        },
        password: {
          value: "",
          isValid: false,
        },
      },
      false
    );
    
    const authSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/joshua/authentication/teacher/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
  
        navigate("/");
        console.log(responseData);
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

      <div className="Login">
        {isLoading && <LoadingSpinner asOverlay />}

        <center>
          <div className="rectangle">
            <form onSubmit={authSubmitHandler}>
              <h1>Teacher Login</h1>
              
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
      </button><br />
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

export default TeacherLogin;
