
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

const SignUpClass = ({ onPasscodeVerified }) => {
    const navigate = useNavigate();
  
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm(
      {
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
          process.env.REACT_APP_BACKEND_URL + "/passcode/login",
          "POST",
          JSON.stringify({
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        onPasscodeVerified();
        navigate("/signupp");
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
              <h1>Admin Sign-Up Passcode</h1>
              
              
              <div className="form-group">
              <Input
              element="input"
              id="password"
              type="password"
              label="Passcode"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password"
              onInput={inputHandler}
            />
              </div>
              
            <br />
              <div className="form-group">
                <Button
                  type="submit"
                  className="submit-btn"
                  
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

export default SignUpClass;
