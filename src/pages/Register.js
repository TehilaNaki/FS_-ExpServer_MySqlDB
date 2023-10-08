import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Register.css";
import axios from 'axios';

const addUser = (newUser) => { 
  axios.post('http://localhost:3010/users', newUser )
  .then(response => {
    console.log(response.data);
    console.log('success');
  })
  .catch(error => {
    console.error(error);
  });
};
function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user =  { name: fullName , username: username,  password: password, email: email, phone: phone , website: website };
    console.log(user);
    // Save the authorized user to local storage    
    var id= addUser(user);
    user["id"]=id;
    localStorage.setItem('user', JSON.stringify(user));
    navigate("/");
  };


  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              required
              type="text"
              id="fullName"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              required
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              required
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              required
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              required
              type="text"
              id="phone"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              required
              type="text"
              id="website"
              placeholder="Enter website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="register-button">
            Register
          </button>
          <Link to="/login" className="login-link">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
