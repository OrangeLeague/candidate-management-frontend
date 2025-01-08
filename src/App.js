// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import CandidateList from "./components/CandidateList";
import AdminDashboard from "./components/AdminDashboard";
import CandidateScreen from "./components/CandidateScreen";
import Header from "./common/Header";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert components

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state to show the welcome message

  console.log(authenticated, "authenticatedsdsds");
  const [activeTeamId, setActiveTeamId] = useState(() => {
    // Get the saved activeTeamId from localStorage (or use a default value)
    const savedTeamId = localStorage.getItem("activeTeamId");
    return savedTeamId ? JSON.parse(savedTeamId) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Save activeTeamId to localStorage whenever it changes
    if (activeTeamId) {
      localStorage.setItem("activeTeamId", JSON.stringify(activeTeamId));
    }
  }, [activeTeamId]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setOpenSnackbar(true); // Show the Snackbar when login is successful
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <>
                {/* <Logout setAuthenticated={setAuthenticated} /> */}
                <Header />
                <CandidateList
                  activeTeamId={activeTeamId}
                  setAuthenticated={setAuthenticated}
                />
              </>
            ) : (
              <>
                <Header />
                <LoginForm
                  setAuthenticated={setAuthenticated}
                  setActiveTeamId={setActiveTeamId}
                  onLoginSuccess={handleLoginSuccess}
                />
              </>
            )
          }
        />
        <Route
          path="/admin"
          element={
            authenticated ? (
              <>
                <Header />
                {/* <Logout setAuthenticated={setAuthenticated} /> */}
                <AdminDashboard setAuthenticated={setAuthenticated} />
              </>
            ) : (
              <>
                <Header />
                <LoginForm
                  setAuthenticated={setAuthenticated}
                  authenticated={authenticated}
                  setActiveTeamId={setActiveTeamId}
                  onLoginSuccess={handleLoginSuccess}
                />
              </>
            )
          }
        />
        <Route
          path="/candidates/:id"
          element={
            <>
              {/* <Header /> */}
              <CandidateScreen />
            </>
          }
        />
      </Routes>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Snackbar will auto-hide after 3 seconds
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Top-right corner
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Welcome to OLVT Talent Sphere!
        </Alert>
      </Snackbar>
    </Router>
  );
};

export default App;
