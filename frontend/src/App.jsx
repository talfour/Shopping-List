import React, { useState } from "react";

import Nav from "../components/Nav";
import Home from "../pages/Home";
import Login from "../components/Login";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../utils/PrivateRoute";

//tutaj dodać auth



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <PrivateRoute auth={{isAuthenticated}}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
