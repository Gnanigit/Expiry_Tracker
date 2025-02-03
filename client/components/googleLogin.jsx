import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./login.scss";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authActions";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailLogin = (e) => {
    e.preventDefault();
    const loginType = "Email & password";
    dispatch(setUser(username, email, loginType, password));
    navigate("/profile");
  };

  const handleLoginSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;
    const decodedCredential = JSON.parse(atob(credential.split(".")[1]));
    const fullName = decodedCredential.name;
    const email = decodedCredential.email;
    const loginType = "Login with Google";
    dispatch(setUser(fullName, email, loginType, ""));
    navigate("/profile");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back!</h1>
        <form className="email-login-form" onSubmit={handleEmailLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login with Email
          </button>
        </form>
        <div className="divider">
          <span>OR</span>
        </div>
        <p className="login-subtitle">
          Sign in with your Google account to continue.
        </p>
        <GoogleLogin
          className="google-login-auth"
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </div>
  );
};

export default Login;
