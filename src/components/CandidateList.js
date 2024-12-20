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
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import Logout from "../Logout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import selectImg from "../assests/select.png";
import rejectImg from "../assests/reject.png";

const CandidateList = ({ activeTeamId, setAuthenticated }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openRejectionDialog, setOpenRejectionDialog] = useState(false); // For rejection comment dialog
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [rejectionComment, setRejectionComment] = useState(""); // To store the rejection comment
  const [searchQuery, setSearchQuery] = useState("");

  const [timeSlots, setTimeSlots] = useState({});
  const [error, setError] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  console.log(timeSlots, "timeSlotsdsdsd",selectedDateTime);
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        // setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/candidates/get-candidates/${selectedCandidate?.id}/time-slots/`
        );
        setTimeSlots(response.data.time_slots || {});
        setError(""); // Clear previous errors if any
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching time slots."
        );
      } finally {
        // setLoading(false);
      }
    };

    if (selectedCandidate?.id) {
      fetchTimeSlots();
    }
  }, [selectedCandidate?.id]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/candidates/", {
        params: { activeTeamId },
        withCredentials: true,
      });
      setCandidates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [activeTeamId,fetchCandidates]);

  const handleScheduleInterview = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenModal(true);
  };

  const handleConfirmSchedule = async () => {
    // if (!selectedDateTime || selectedDateTime < new Date()) {
    //   alert("Please select a valid future date and time.");
    //   return;
    // }

    const token = localStorage.getItem("access_token");
    try {
      await axios.post(
        `http://localhost:8000/candidates/update_status/${selectedCandidate.id}/Interview Scheduled/`,
        { scheduled_time: selectedTimeSlot.toString() },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setOpenModal(false);
      setSelectedCandidate(null);
      setSelectedDateTime(new Date());
      fetchCandidates();
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCandidate(null);
  };

  const handleReject = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenRejectionDialog(true); // Open rejection comment dialog
  };

  const handleRejectionSubmit = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.post(
        `http://localhost:8000/candidates/update_status/${selectedCandidate.id}/Rejected/`,
        { comment: rejectionComment }, // Send the rejection comment to backend
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setOpenRejectionDialog(false); // Close the rejection comment dialog
      setRejectionComment(""); // Clear the comment input
      fetchCandidates(); // Fetch the updated candidates list
    } catch (error) {
      console.error("Error rejecting candidate:", error);
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.post(
        `http://localhost:8000/candidates/update_status/${id}/${status}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchCandidates();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSlotChange = (selectedSlot) => {
    setSelectedTimeSlot(selectedSlot);
  };

  const confirmSchedule = () => {
    if (!selectedTimeSlot) {
      alert("Please select a time slot.");
      return;
    }
    handleConfirmSchedule(); // Pass the selected time slot to the parent handler
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

  const filteredCandidates = candidates.candidates?.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skillset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        padding: "20px",
        height: "100vh",
        backgroundColor: "#e5edf5",
        paddingLeft: "60px",
        paddingRight: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 700, // Bold text
            fontSize: "48px", // Font size
            textAlign: "center", // Center-align text
            background: "linear-gradient(to right, #ffb622, #fe2a58)", // Gradient color
            WebkitBackgroundClip: "text", // Clip the gradient to the text
            color: "transparent", // Makes the text itself transparent to show the gradient
            padding: "20px 0", // Padding for spacing above and below
            lineHeight: "60px", // Line height
          }}
        >
          OLVT Talent Sphere
        </Typography>
        <Logout setAuthenticated={setAuthenticated} />
      </div>
      <div style={{ margin: "20px 0" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search by name, skillset, or status"
          sx={{
            borderRadius: 1, // Adds rounded corners
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px", // Smooth rounded corners
              backgroundColor: "white", // Set background to white
              "& fieldset": {
                borderColor: "transparent", // Remove default border
              },
              "&:hover fieldset": {
                borderColor: "transparent", // Remove hover border color
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent", // Remove blue border on focus
              },
            },
          }}
          InputProps={{
            style: {
              borderRadius: "12px", // Match the rounded corners
              boxShadow:
                "inset 4px 2px 4px 0 rgba(95, 157, 231, 0.48), inset -4px -4px 2px 0 rgba(183, 211, 244, 0.2)", // Box shadow styling
            },
          }}
        />
      </div>

      {/* <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Years of Experience</strong>
              </TableCell>
              <TableCell>
                <strong>Skillset</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCandidates?.map((candidate) => (
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
                  {candidate.scheduled_time && (
                    <Typography
                      variant="caption"
                      sx={{
                        marginTop: "4px",
                        color: "gray",
                        fontStyle: "italic",
                      }}
                    >
                      {new Date(candidate.scheduled_time).toLocaleString(
                        "en-US",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Link
                        href={`http://localhost:8000/${candidate.cv}`}
                        target="_blank"
                        underline="hover"
                        sx={{ color: "primary.main", fontWeight: "bold" }}
                      >
                        View CV
                      </Link>
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        href={`http://localhost:8000/${candidate.cv}`}
                        download
                        sx={{
                          textTransform: "none",
                        }}
                      >
                        Download
                      </Button>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      {candidate.status === "Open" && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{
                            textTransform: "none",
                            boxShadow: 2,
                          }}
                          onClick={() => handleScheduleInterview(candidate)}
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
                            sx={{
                              textTransform: "none",
                              boxShadow: 2,
                            }}
                            onClick={() =>
                              updateStatus(candidate.id, "Selected")
                            }
                          >
                            Select
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{
                              textTransform: "none",
                              boxShadow: 2,
                            }}
                            onClick={() => handleReject(candidate)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      <TableContainer
        component={Paper}
        sx={{
          boxShadow:
            "4px 2px 8px 0 rgba(95, 157, 231, 0.48), -4px -2px 4px 0 rgba(255, 255, 255, 0.3)", // Subtle white shadow
          borderRadius: "12px",
          border: "none",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  sx={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
                >
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
                >
                  Y.O.E
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
                >
                  Skillset
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
                >
                  Status
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
                >
                  Resume
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
                >
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCandidates?.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell
                  sx={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
                >
                  {candidate.name}
                </TableCell>
                <TableCell
                  sx={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
                >
                  {candidate.years_of_experience}
                </TableCell>
                <TableCell
                  sx={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
                >
                  {candidate.skillset}
                </TableCell>
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
                  {candidate.scheduled_time && (
                    <Typography
                      variant="caption"
                      sx={{
                        marginTop: "4px",
                        color: "#7E97B8",
                        fontStyle: "italic",
                      }}
                    >
                      {new Date(candidate.scheduled_time).toLocaleString(
                        "en-US",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      href={`http://localhost:8000/${candidate.cv}`}
                      target="_blank"
                      sx={{ color: "#F15D27" }} // Hex code for orange
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      href={`http://localhost:8000/${candidate.cv}`}
                      download
                      sx={{ color: "#F15D27" }} // Hex code for orange
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {candidate.status === "Open" && (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{
                          textTransform: "none",
                          borderRadius: "20px",
                          background: "white",
                          color: "#F15D27",
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                        onClick={() => handleScheduleInterview(candidate)}
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
                          sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            fontWeight: "bold",
                          }}
                          onClick={() => updateStatus(candidate.id, "Selected")}
                        >
                          <img
                            src={selectImg}
                            alt="select-img"
                            style={{ height: "24px", width: "24px" }}
                          />
                          Select
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            background: "white",
                            color: "black",
                          }}
                          onClick={() => handleReject(candidate)}
                        >
                          <img
                            src={rejectImg}
                            alt="select-img"
                            style={{ height: "24px", width: "24px" }}
                          />
                          Reject
                        </Button>
                      </>
                    )}
                    {candidate.status === "Selected" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            fontWeight: "bold",
                          }}
                          onClick={() => updateStatus(candidate.id, "Selected")}
                          disabled
                        >
                          <img
                            src={selectImg}
                            alt="select-img"
                            style={{ height: "24px", width: "24px" }}
                          />
                          Select
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            background: "white",
                            color: "black",
                          }}
                          onClick={() => handleReject(candidate)}
                          disabled
                        >
                          <img
                            src={rejectImg}
                            alt="select-img"
                            style={{ height: "24px", width: "24px" }}
                          />
                          Reject
                        </Button>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Scheduling Interview */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm" // Adjust width of the modal
        style={{ maxHeight: "80vh" }} // Ensure modal doesn't exceed viewport height
      >
        <DialogTitle
          style={{ color: "#7E97B8", fontSize: "20px", fontWeight: 700 }}
        >
          Schedule Interview
        </DialogTitle>
        <DialogContent
          style={{
            maxHeight: "60vh", // Limit the height of the content area
            overflowY: "auto", // Enable scrolling when content overflows
          }}
        >
          <div style={{ color: "#7E97B8", fontSize: "16px", fontWeight: 400 }}>
            Select earliest{" "}
            <span
              style={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
            >
              ONE
            </span>{" "}
            timeslot for 1-hour Interview with{" "}
            <span
              style={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
            >
              {selectedCandidate?.name}.
            </span>
          </div>

          {loading ? (
            <CircularProgress />
          ) : error ? (
            <p>{error}</p>
          ) : Object.keys(timeSlots).length === 0 ? (
            <p>No available time slots.</p>
          ) : (
            Object.entries(timeSlots).map(([date, slots]) => (
              <div key={date} style={{ marginTop: "1rem" }}>
                <h4 style={{ marginBottom: "0.5rem" }}>{date}</h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                    gap: "0.5rem",
                  }}
                >
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotChange(`${date} ${slot}`)}
                      style={{
                        padding: "10px",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow:
                          "4px 2px 8px 0 rgba(95, 157, 231, 0.48), -4px -2px 4px 0 rgba(255, 255, 255, 0.3)",
                        backgroundColor:
                          selectedTimeSlot === `${date} ${slot}`
                            ? "#F18C27"
                            : "#fff",
                        color:
                          selectedTimeSlot === `${date} ${slot}`
                            ? "#fff"
                            : "#7E97B8",
                        cursor: "pointer",
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            padding: "20px",
          }}
        >
          <Button
            onClick={handleCloseModal}
            color="secondary"
            style={{
              padding: "12px 16px",
              boxShadow:
                "4px 2px 8px 0 rgba(95, 157, 231, 0.48), -4px -2px 4px 0 rgba(255, 255, 255, 0.3)",
              borderRadius: "12px",
              border: "none",
              width: "100%",
              color: "#7E97B8",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmSchedule}
            color="primary"
            style={{
              padding: "12px 16px 12px 16px",
              boxShadow:
                "4px 2px 8px 0 rgba(95, 157, 231, 0.48), -4px -2px 4px 0 rgba(255, 255, 255, 0.3)",
              borderRadius: "12px",
              border: "none",
              width: "100%",
              backgroundColor: "#F15D27",
              color: "#FBFCFE",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Schedule
          </Button>
        </div>
      </Dialog>

      {/* Rejection Comment Modal */}
      <Dialog
        open={openRejectionDialog}
        onClose={() => setOpenRejectionDialog(false)}
      >
        <DialogTitle
          style={{ color: "#7E97B8", fontSize: "20px", fontWeight: 700 }}
        >
          Reject Candidate
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{
              color: "#7E97B8",
              fontSize: "16px",
              fontWeight: 400,
              marginBottom: "16px",
            }}
          >
            Please provide a reason for rejecting{" "}
            <span
              style={{ color: "#7E97B8", fontSize: "16px", fontWeight: 700 }}
            >
              {selectedCandidate?.name}.
            </span>
          </DialogContentText>
          <TextField
            fullWidth
            label="Rejection Comment"
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        {/* <DialogActions> */}
        <div
          style={{
            display: "flex",
            paddingLeft: "25px",
            paddingRight: "20px",
            paddingBottom: "20px",
            gap:'10px'
          }}
        >
          <Button
            onClick={() => setOpenRejectionDialog(false)}
            color="secondary"
            style={{
              width: "100%",
              color: "#FBFCFE",
              backgroundColor: "#F15D27",
              borderRadius:'12px',
              fontSize:'16px',
              fontWeight:700
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectionSubmit}
            color="primary"
            style={{
              width: "100%",
              color: "#F15D27",
              borderRadius:'12px',
              boxShadow:
                "4px 2px 8px 0 rgba(95, 157, 231, 0.48), -4px -2px 4px 0 rgba(255, 255, 255, 0.3)",
              fontSize:'16px',
              fontWeight:700
            }}
          >
            Submit
          </Button>
        </div>
        {/* </DialogActions> */}
      </Dialog>
    </Box>
  );
};

export default CandidateList;
