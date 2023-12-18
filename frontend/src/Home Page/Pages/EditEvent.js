import React, { useContext, useEffect, useState } from "react";
import "./EditEvent.css";
import { message, notification } from "antd";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import { useNavigate, useParams } from "react-router-dom";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { useForm } from "../../Shared/Hooks/form-hook";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_DATE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_TIME,
} from "../../Shared/util/validators";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";
import Card from "../../Shared/Components/UIElements/Card";
import { AuthContext } from "../../Shared/Context/Auth-context";

function EditEvent() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedEvent, setLoadedEvent] = useState();

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
        value: null,
        isValid: false,
      },
      time: {
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/event/get/${id}`
        );
        setLoadedEvent(responseData.event);
        setFormData(
          {
            title: {
              value: responseData.event.title,
              isValid: true,
            },
            description: {
              value: responseData.event.description,
              isValid: true,
            },
            image: {
              value: null,
              isValid: true,
            },
            date: {
              value: new Date(responseData.event.date)
                .toISOString()
                .slice(0, 10),
              isValid: true,
            },
            time: {
              value: responseData.event.time,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchEvent();
  }, [sendRequest, id, setFormData, inputHandler]);

  const eventSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("date", formState.inputs.date.value);
      formData.append("time", formState.inputs.time.value);

      if (formState.inputs.image.value) {
        formData.append("image", formState.inputs.image.value);
      }

      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/event/update/${id}`,
        "PATCH",
        formData,
        { Authorization: "Bearer " + auth.token }
      );
      message.success("Event edited successfully");

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
  if (!loadedEvent && !error) {
    return (
      <div className="center">
        <Card>
          <h2>The event is not identified</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedEvent && (
        <div className="EditEvent">
          {isLoading && <LoadingSpinner asOverlay />}

          <center>
            <div className="rectangle">
              <form onSubmit={eventSubmitHandler}>
                <h1>Form</h1>

                <div className="form-group">
                  <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
                    errorText="Please enter a valid title"
                    onInput={inputHandler}
                    initialValue={loadedEvent.title}
                    initialValid={true}
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
                    initialValue={loadedEvent.description}
                    initialValid={true}
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
                    initialValue={loadedEvent.date}
                    initialValid={true}
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
                    initialValue={loadedEvent.time}
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

export default EditEvent;
