import logo from './logo.svg';
import './css/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Info from "./pages/Info";
import Posts from "./pages/Posts";
import Logout from "./pages/Logout";
import Todos from "./pages/Todos";
import React, { useState } from "react";
import ProtectedRoute from './pages/ProtectedRoute';
import Register from './pages/Register';


function App() {
  const [user, setUser] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/" element={
          <ProtectedRoute user={user} setUser={setUser}>
            <Home user={user} />
          </ProtectedRoute>
        } >
          <Route path= "users/:name/Info" element={<Info user={user} />} />
          <Route path="users/:name/Todos" element={<Todos  user={user} />} />
          <Route path="users/:name/Posts" element={<Posts user={user} />} />
          <Route path="users/:name/Posts/:postId" element={<Posts user={user}/>} />
          <Route path="users/:name/Logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;