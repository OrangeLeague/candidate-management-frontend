// LoginForm.js
import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

const LoginForm = ({ setAuthenticated ,setActiveTeamId,authenticated,onLoginSuccess}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://candidate-management-backend-1.onrender.com/candidates/login/",//  http://localhost:8000/candidates/login/
        {
          username,
          password,
        },
        {
          withCredentials: true, // Ensure the cookie is sent with the request
        }
      );
      localStorage.setItem("access_token", response.data.access); // Store JWT in localStorage
      setActiveTeamId(response?.data?.team_id)
      setAuthenticated(true); // Update authentication state
      setSnackbarOpen(true); // Show success message
      onLoginSuccess();
    } catch (error) {
      console.error("Login failed", error);
      setError("Invalid username or password.");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
      }}
    >
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ padding: "10px" }}
      >
        Login
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Login successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;
