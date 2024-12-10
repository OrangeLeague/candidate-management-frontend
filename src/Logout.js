// Logout.js
import React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Logout = ({ setAuthenticated }) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      // Make a POST request to the backend to handle the logout
      const response = await axios.post(
        "https://candidate-management-backend-1.onrender.com/logout/",  //http://localhost:8000/candidates/
        {},
        {
          withCredentials: true, // Ensure the session cookie is sent with the request
        }
      );

      // Clear the JWT token from localStorage (if you're using JWT for authentication)
      localStorage.removeItem("access_token");

      // Update the state to reflect that the user is logged out
      setAuthenticated(false);

      // Show success message
      setSnackbarOpen(true);
      console.log(response.data.message); // Optionally, log logout success message
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        style={{ marginTop: "20px" }}
      >
        Logout
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
          Successfully logged out!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Logout;
