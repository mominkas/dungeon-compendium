import React, { useState } from "react";
import LoginService from "../services/LoginService";
import { Button, Form, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const loginService = LoginService.getInstance();
  const [failedLogin, setFailedLogin] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const login = await loginService.login(form.username, form.password);

    if (login) {
      navigate("/", { replace: true });
    } else {
      setFailedLogin(true);
    }
  };

  const canSubmit = form.username && form.password;

  return (
    <div className="d-flex flex-column justify-content-center align-content-center">
      <h6 className="custom-h6-label">Login</h6>
      <Form
        className="d-flex flex-column justify-content-center gap-2"
        onSubmit={handleSubmit}
      >
        <FormControl
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="username"
        />
        <FormControl
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="password"
        />
        <Button
          className="btn btn-success custom-add-btn"
          type="submit"
          disabled={!canSubmit}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
