import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Link,
  Box,
} from "@mui/material";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("https://candidate-management-backend-1.onrender.com/candidates/", {
        withCredentials: true, // Ensure the cookie is sent with the request
      });
      setCandidates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
    }
  };

  // Fetch candidates from the server
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Update candidate status
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("access_token"); // Get the JWT token from localStorage
    try {
      await axios.post(
        `https://candidate-management-backend-1.onrender.com/candidates/update_status/${id}/${status}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the header for authentication
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
    fetchCandidates();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: "20px" }}>
        Candidate Management
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Years of Experience</strong></TableCell>
              <TableCell><strong>Skillset</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.candidates?.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.years_of_experience}</TableCell>
                <TableCell>{candidate.skillset}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        candidate.status === "Open"
                          ? "green"
                          : candidate.status === "Interview Scheduled"
                          ? "orange"
                          : candidate.status === "Selected"
                          ? "blue"
                          : "red",
                    }}
                  >
                    {candidate.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Link
                    href={candidate.cv_url}
                    download
                    underline="hover"
                    sx={{ marginRight: "10px" }}
                  >
                    Download CV
                  </Link>
                  {candidate.status === "Open" && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() =>
                        updateStatus(candidate.id, "Interview Scheduled")
                      }
                    >
                      Schedule Interview
                    </Button>
                  )}
                  {candidate.status === "Interview Scheduled" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ marginRight: "5px" }}
                        onClick={() => updateStatus(candidate.id, "Selected")}
                      >
                        Select
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => updateStatus(candidate.id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CandidateList;
