import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import axios from 'axios';

export const AuthContext = React.createContext(null);

function Login({ setUser }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    
    axios.get(`http://localhost:3010/users/${userName}`, {
      params: { password }
    })
      .then(response => {
        console.log(response.data);
        window.localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        navigate("/");
      })
      .catch(error => {
        console.error('Error retrieving user:', error);
        setError("Your Username or Password wrong!");
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">User Name</label>
            <input
              required
              type="text"
              id="userName"
              placeholder="Enter user-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
         <Link to="/Register" className="register-link">
            Register
          </Link> 
        </form>
      </div>
    </div>
  );
}

export default Login;
