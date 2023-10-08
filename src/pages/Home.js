import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "../css/Home.css";



const Home = () => {
    const [user, setUser] = useState("");
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")))
      },[]);

  const usermame_active = user.username;
  console.log("usermame_active: ");
  console.log(usermame_active);
  return (
    <div className="home-container">
      <h1 className="title">Welcome {user?.name} !</h1>
      <nav className="navbar">
        <ul className="navbarList">
          <li className="navbarItem">
            <NavLink to={`/users/${user.name}/info`} className="navbarButton">
              Info
            </NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to={`/users/${user.name}/todos`} className="navbarButton">
              Todos
            </NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to={`/users/${user.name}/posts`} className="navbarButton">
              Posts
            </NavLink>
          </li>
          <li className="navbarItem">
            <NavLink to={`/users/${user.name}/logout`}   className="navbarButton">
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
        <Outlet user={user}/>
    </div>
  );
};

export default Home;