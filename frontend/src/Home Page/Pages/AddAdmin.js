import React, { useState } from "react";
import "../Pages/AddAdmin.css";
import un from "../components/images/user.png";
import pw from "../components/images/pw.png";
import bg from "../components/images/light rays.png";
import url from "../Baseurl";
import { notification } from "antd";

import loginImg from "../components/images/robot.png";

function AddAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail({ value: event.target.value });
  };
  const handlePasswordChange = (event) => {
    setPassword({ value: event.target.value });
  };
  const onsubmit = async (event) => {
    event.preventDefault();

    const formValues = {
      email: email.value,
      password: password.value,
    };
    console.log(formValues);

    const Schoolresponse = await fetch(url + "api/admin", {
      method: "POST",
      body: JSON.stringify({ ...formValues }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const SchoolResponseJson = await Schoolresponse.json();
    if (SchoolResponseJson.success == "true") {
      notification.success({
        message: `Admin ${formValues.email} successfully created`,
        placement: "topRight",
      });
    } else {
      notification.error({
        message: `Admin ${formValues.email} is not created`,
        placement: "top",
      });
    }
  };
  function myFunction() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  return (
    <div className="Addsc " style={{ overflow: "auto" }}>
      <center>
        <div className="form" onSubmit={onsubmit}>
          <div className="loginImage">
            <img
              src={loginImg}
              width="300"
              style={{ position: "relative" }}
              alt="login"
            />
            <br />
            <br />
            <br />

            <form>
              <h1>Add Admin</h1>
              <img src={un} height="25px" /> &nbsp;{" "}
              <input
                onChange={handleEmailChange}
                className="o"
                type="text"
                placeholder="Email"
              />
              <br />
              <br />
              <img src={pw} height="25px" /> &nbsp;{" "}
              <input
                onChange={handlePasswordChange}
                className="o"
                type="password"
                id="myInput"
                placeholder="Password"
              />
              <br />
              <br />
              <input
                type="checkbox"
                id="showImageButton"
                onClick={myFunction}
              />
              &nbsp; Show Password <br />
              <br />
              <input type="submit" value="Log-In" />
            </form>
          </div>
        </div>
      </center>
    </div>
  );
}

export default AddAdmin;
