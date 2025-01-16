// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import CandidateList from "./components/CandidateList";
import AdminDashboard from "./components/AdminDashboard";
import CandidateScreen from "./components/CandidateScreen";
import Header from "./common/Header";
import { Snackbar, Alert, Typography } from "@mui/material"; // Import Snackbar and Alert components

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // Admin authentication
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state to show the welcome message
  const [activeRole, setActiveRole] = useState("");
  const[activeTeamName,setActiveTeamName]=useState("");


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
  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   if (token) {
  //     setAuthenticated(true);
  //   }
  // }, []);

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
                <div
                  style={{
                    backgroundColor: "#F6F6F6",
                    display: "flex",
                    justifyContent: "space-between",
                    paddingRight: "60px",
                    paddingTop:'30px',
                    alignItems:'center'
                  }}
                >
                  <Header />
                  <Typography
                    style={{
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      background: "white",
                      color: "#F15D27",
                      fontWeight: 700,
                      fontSize: "16px",
                      cursor: "pointer",
                      padding: "12px 16px",
                      justifyContent:'center',
                      height:'max-content',
                      borderRadius: "12px",
                    }}
                  >
                    Welcome <span style={{color:"#0b0909c2",marginLeft:'4px'}}>{activeTeamName}</span>
                  </Typography>
                </div>
                <CandidateList
                  activeTeamId={activeTeamId}
                  setAuthenticated={setAuthenticated}
                  activeTeamName={activeTeamName}
                />
              </>
            ) : (
              <>
                <Header />
                <LoginForm
                  setAuthenticated={setAuthenticated}
                  setActiveTeamId={setActiveTeamId}
                  onLoginSuccess={handleLoginSuccess}
                  setActiveRole={setActiveRole}
                  activeRole={"candidate"}
                  setActiveTeamName={setActiveTeamName}
                />
              </>
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAdminAuthenticated ? (
              <>
                <Header />
                {/* <Logout setAuthenticated={setAuthenticated} /> */}
                <AdminDashboard
                  setAuthenticated={setIsAdminAuthenticated}
                  activeRole={activeRole}
                />
              </>
            ) : (
              <>
                <Header />
                <LoginForm
                  // setAuthenticated={setAuthenticated}
                  // authenticated={authenticated}
                  setAuthenticated={setIsAdminAuthenticated}
                  authenticated={isAdminAuthenticated}
                  setActiveTeamId={setActiveTeamId}
                  onLoginSuccess={handleLoginSuccess}
                  setActiveRole={setActiveRole}
                  activeRole={"admin"}
                  setActiveTeamName={setActiveTeamName}
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
