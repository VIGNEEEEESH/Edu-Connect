import React, { useContext } from "react";
import "./AddEvent.css";
import { message, notification } from "antd";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { useForm } from "../../Shared/Hooks/form-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_DATE,
  VALIDATOR_TIME,
  VALIDATOR_MINLENGTH,
} from "../../Shared/util/validators";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import { AuthContext } from "../../Shared/Context/Auth-context";

function AddEvent() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      date: {
        value: "",
        isValid: false,
      },
      time: {
        value: "",
        isValid: false,
      },

      image: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();
  const eventSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("date", formState.inputs.date.value);
      formData.append("time", formState.inputs.time.value);
      formData.append("image", formState.inputs.image.value);
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/event/add",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      message.success("Event added successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div className="AddEvent">
        {isLoading && <LoadingSpinner asOverlay />}

        <center>
          <div className="rectangle">
            <form onSubmit={eventSubmitHandler}>
              <h1>Event Form</h1>
              <div className="form-group">
                <Input
                  id="title"
                  element="input"
                  type="text"
                  label="Title"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter a valid title"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="description"
                  element="input"
                  type="text"
                  label="Description"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter a valid description"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="date"
                  element="input"
                  type="date"
                  label="Date"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_DATE()]}
                  errorText="Please enter a valid date (YYYY-MM-DD)"
                  onInput={inputHandler}
                />
              </div>
              <div className="form-group">
                <Input
                  id="time"
                  element="input"
                  type="time"
                  label="Time"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_TIME()]}
                  errorText="Please enter a valid time (HH:MM)"
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

export default AddEvent;
