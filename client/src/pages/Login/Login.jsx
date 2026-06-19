import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginSuccess } from "../../features/auth/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4000/users"
      );

      const users = await response.json();

      const user = users.find(
        (u) =>
          u.email === formData.email &&
          u.password === formData.password
      );

      if (!user) {
        alert("Please Register First");
        return;
      }

      dispatch(
        loginSuccess({
          user,
          token: "fake-jwt-token",
        })
      );

      alert("Login Success");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>

        <br />
        <br />

        <p>
          Don't have an account?
        </p>

        <Link to="/register">
          Register
        </Link>
      </form>
    </div>
  );
}

export default Login;