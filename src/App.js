// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import Logout from "./Logout";
import CandidateList from "./components/CandidateList";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <>
                <Logout setAuthenticated={setAuthenticated} />
                <CandidateList />
              </>
            ) : (
              <LoginForm setAuthenticated={setAuthenticated} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            authenticated ? (
              <>
                <Logout setAuthenticated={setAuthenticated} />
                <AdminDashboard />
              </>
            ) : (
              <LoginForm setAuthenticated={setAuthenticated} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
