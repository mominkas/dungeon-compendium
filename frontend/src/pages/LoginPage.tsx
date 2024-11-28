import React, { useState } from "react";
import LoginService from "../services/LoginService";
import { Alert, Button, Form, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const loginService = LoginService.getInstance();
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [onSignup, setOnSignup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const alertTimeout = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const login = await loginService.login(form.username, form.password);

    if (login) {
      navigate("/", { replace: true });
    } else {
      const msg = "Invalid user name or password";
      setAlertMessage(msg);
      setAlertVariant("danger");
      alertTimeout();
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch(`http://localhost:5001/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ name: form.username, password: form.password }),
      });

      if (!result.ok) {
        const msg = await result.json();
        setAlertMessage(msg.error);
        setAlertVariant("danger");
        alertTimeout();
        return;
      }

      const success = await result.json();
      setAlertMessage(success.msg);
      setAlertVariant("success");
      alertTimeout();
      setOnSignup(false);
    } catch (error) {
      console.error("Error during signup:", error);
      setAlertMessage("An error occurred during signup");
      setAlertVariant("danger");
      alertTimeout();
    }
  };

  const singUpClick = () => {
    setOnSignup(!onSignup);
  };

  const canSubmit = form.username && form.password;

  return (
    <div className="d-flex">
      {!onSignup && (
        <div
          className="bg-white p-4 rounded shadow-lg"
          style={{ width: "300px" }}
        >
          <h4 className="text-center mb-4">Login</h4>
          <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            <FormControl
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="py-2"
            />
            <FormControl
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="py-2"
            />
            <Button
              variant="success"
              type="submit"
              disabled={!canSubmit}
              className="py-2"
            >
              Login
            </Button>
            <Button
              variant="outline-primary"
              disabled={!canSubmit}
              className="py-2"
              onClick={singUpClick}
            >
              Sign Up
            </Button>
          </Form>
        </div>
      )}
      {onSignup && (
        <div
          className="bg-white p-4 rounded shadow-lg"
          style={{ width: "300px" }}
        >
          <h4 className="text-center mb-4">Sign Up</h4>
          <Form
            className="d-flex flex-column gap-3"
            onSubmit={handleSignupSubmit}
          >
            <FormControl
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="py-2"
            />
            <FormControl
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="py-2"
            />
            <Button
              variant="success"
              type="submit"
              disabled={!canSubmit}
              className="py-2"
            >
              Sign Up
            </Button>
            <Button
              variant="outline-primary"
              disabled={!canSubmit}
              className="py-2"
              onClick={singUpClick}
            >
              Return to Login
            </Button>
          </Form>
        </div>
      )}
      {showAlert && (
        <Alert
          show={showAlert}
          variant={alertVariant}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </div>
  );
};

export default LoginPage;
