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
  TextField,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Tabs,
  Tab,
  Pagination,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Logout from "../Logout";

const AdminDashboard = ({ setAuthenticated, activeRole }) => {
  const [teams, setTeams] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1); // State for managing tabs
  const [newTeam, setNewTeam] = useState({
    username: "",
    password: "",
    name: "",
    role: activeRole,
  });
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    years_of_experience: "",
    skillset: "",
    email: "",
    status: "Open",
    cv: null,
    notice_period: "",
    current_company: "",
    qualification: "",
    current_location: "",
    vendor: "OLVT",
  });
  const [editingCandidate, setEditingCandidate] = useState(null);
  const[addCandidateLoading,setAddCandidateLoading]=useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default items per page
  console.log(pageSize, "pageSize");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState([candidates]);
  console.log(filteredCandidates,'filteredCandidatessdfsdfsdf',searchQuery);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredCandidates(candidates); // Reset to all candidates if query is empty
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = candidates.filter((candidate) => {
      return (
        (candidate.name &&
          candidate.name.toLowerCase().includes(lowerCaseQuery)) ||
        (candidate.years_of_experience &&
          candidate.years_of_experience.toString().includes(lowerCaseQuery)) ||
        (candidate.skillset &&
          candidate.skillset.toLowerCase().includes(lowerCaseQuery)) ||
        (candidate.email &&
          candidate.email.toLowerCase().includes(lowerCaseQuery)) ||
        (candidate.vendor &&
          candidate.vendor.toLowerCase().includes(lowerCaseQuery)) ||
        (candidate.current_company &&
          candidate.current_company.toLowerCase().includes(lowerCaseQuery)) ||
        (candidate.current_location &&
          candidate.current_location.toLowerCase().includes(lowerCaseQuery)) ||
        (candidate.qualification &&
          candidate.qualification.toLowerCase().includes(lowerCaseQuery)) ||
        (candidate.status &&
          candidate.status.toLowerCase().includes(lowerCaseQuery))
      );
    });

    setFilteredCandidates(filtered);
  };

  const fetchAdminData = async (page = 1, size = 10) => {
    try {
      const teamResponse = await axios.get(
        "https://candidate-management-backend-1.onrender.com/candidates/admin/teams/get-teams"
      );
      const candidateResponse = await axios.get(
        "https://candidate-management-backend-1.onrender.com/candidates/admin/candidates/get-candidates",
        {
          params: {
            page: page,
            pageSize: size,
          },
        }
      );
      const { candidates, total_pages } = candidateResponse.data;
      setTeams(teamResponse?.data);
      setCandidates(candidates);
      setTotalPages(total_pages);
      setCurrentPage(page);
      setPageSize(size);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setLoading(false);
    }
  };

  // Update filteredCandidates whenever candidates change
  useEffect(() => {
    setFilteredCandidates(candidates);
  }, [candidates]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const addTeam = async () => {
    try {
      await axios.post(
        "https://candidate-management-backend-1.onrender.com/candidates/admin/teams/add",
        newTeam,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setNewTeam({ username: "", password: "", name: "", role: activeRole });
      fetchAdminData();
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  const addCandidate = async () => {
    setAddCandidateLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newCandidate.name);
      formData.append("years_of_experience", newCandidate.years_of_experience);
      formData.append("skillset", newCandidate.skillset);
      formData.append("email", newCandidate.email);
      formData.append("status", newCandidate.status || "Open");
      formData.append("notice_period", newCandidate.notice_period);
      formData.append("current_company", newCandidate.current_company);
      formData.append("qualification", newCandidate.qualification);
      formData.append("current_location", newCandidate.current_location);
      formData.append("vendor", newCandidate.vendor);
      if (newCandidate.cv) {
        formData.append("cv", newCandidate.cv);
      }

      await axios.post(
        "https://candidate-management-backend-1.onrender.com/candidates/admin/candidates/add",
        // "http://127.0.0.1:8000/candidates/admin/candidates/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setNewCandidate({
        name: "",
        years_of_experience: "",
        skillset: "",
        email: "",
        status: "Open",
        cv: null,
        notice_period: "",
        current_company: "",
        qualification: "",
        current_location: "",
        vendor: "OLVT",
      });
      fetchAdminData();
    } catch (error) {
      console.error("Error adding candidate:", error);
    }finally{
      setAddCandidateLoading(false);
    }
  };

  const deleteTeam = async (id) => {
    try {
      await axios.delete(
        `https://candidate-management-backend-1.onrender.com/candidates/admin/teams/${id}/`
      );
      fetchAdminData();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const deleteCandidate = async (id) => {
    try {
      await axios.delete(
        `https://candidate-management-backend-1.onrender.com/candidates/admin/candidates/${id}/`
      );
      fetchAdminData();
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setNewCandidate({
      id: candidate.id,
      name: candidate.name,
      years_of_experience: candidate.years_of_experience,
      skillset: candidate.skillset,
      email: candidate.email,
      status: candidate.status,
      cv: null, // Set to null unless handling file updates
      notice_period: candidate.notice_period,
      current_company: candidate.current_company,
      qualification: candidate.qualification,
      current_location: candidate.current_location,
      vendor: candidate.vendor,
    });
  };

  const handleUpdateCandidate = async (candidate) => {
    try {
      // Create a FormData object to handle text fields and optional file upload
      const formData = new FormData();
      formData.append("name", candidate.name);
      formData.append("years_of_experience", candidate.years_of_experience);
      formData.append("skillset", candidate.skillset);
      formData.append("status", candidate.status);
      formData.append("notice_period", candidate.notice_period);
      formData.append("current_company", candidate.current_company);
      formData.append("qualification", candidate.qualification);
      formData.append("current_location", candidate.current_location);
      formData.append("vendor", candidate.vendor);

      // Append CV file if provided
      if (candidate.cv) {
        formData.append("cv", candidate.cv);
      }

      // Make the API call to update the candidate
      const response = await axios.put(
        `https://candidate-management-backend-1.onrender.com/candidates/admin/candidates/${candidate.id}/update`, // Update endpoint with candidate ID
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      if (response.status === 200) {
        alert("Candidate updated successfully!");
        console.log("Updated Candidate:", response.data);
      }
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert(
        "An error occurred while updating the candidate. Please try again."
      );
    }
  };

  const handleSave = async () => {
    await handleUpdateCandidate(newCandidate);
    setEditingCandidate(null);
    setNewCandidate({
      id: "",
      name: "",
      years_of_experience: "",
      skillset: "",
      email: "",
      status: "",
      cv: null,
      notice_period: "",
      current_company: "",
      qualification: "",
      current_location: "",
      vendor: "",
    });
    fetchAdminData();
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

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    fetchAdminData(newPage);
  };

  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#e5edf5",
        // minHeight: "100vh",
        paddingTop: "0px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            fontSize: "42px",
            background: "linear-gradient(to right, #FFB622, #FE2A58)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            lineHeight: "50px",
            padding: "10px 0",
          }}
        >
          OLVT Admin Dashboard
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              borderRadius: "20px",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              background: "linear-gradient(to bottom, #eef2f7, #ffffff)",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  minWidth: "100px",
                  color: "#9c9c9c",
                  transition: "all 0.3s ease",
                },
                "& .Mui-selected": {
                  color: "#FF8734",
                },
                "& .MuiTabs-flexContainer": {
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-evenly",
                },
                "& .MuiTab-root.Mui-selected": {
                  zIndex: 1,
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                  borderRadius: "16px",
                  padding: "8px 24px",
                  margin: "6px 2px",
                },
                "& .MuiTab-root:not(.Mui-selected)": {
                  margin: "8px 2px",
                  padding: "8px 24px",
                },
              }}
            >
              <Tab label="Team" />
              <Tab label="Candidate" />
            </Tabs>
          </Box>
        </Box>

        <div>
          <Logout setAuthenticated={setAuthenticated} />
        </div>
      </div>

      {activeTab === 0 && (
        <Box>
          <Box
            sx={{
              marginBottom: "30px",
              padding: "30px",
              borderRadius: "15px",
              background: "linear-gradient(145deg, #f0f0f0, #ffffff)",
              boxShadow:
                "10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.7)",
              border: "1px solid #e6e6e6",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow:
                  "12px 12px 25px rgba(0, 0, 0, 0.15), -12px -12px 25px rgba(255, 255, 255, 0.8)",
              },
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                display: "flex",
                marginBottom: "20px",
                fontWeight: "bold",
                color: "#4a90e2",
                textAlign: "center",
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
              }}
            >
              Add Team
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "15px",
              }}
            >
              <TextField
                label="Username"
                value={newTeam.username}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, username: e.target.value })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
              <TextField
                label="Password"
                value={newTeam.password}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, password: e.target.value })
                }
                variant="outlined"
                // type="password"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
              <TextField
                label="Name"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={addTeam}
                sx={{
                  padding: "10px 20px",
                  backgroundColor: "#F15D27",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 700,
                  borderRadius: "25px",
                  boxShadow:
                    "4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#357ABD",
                    transform: "scale(1.05)",
                    boxShadow:
                      "5px 5px 12px rgba(0, 0, 0, 0.25), -5px -5px 12px rgba(255, 255, 255, 0.6)",
                  },
                }}
              >
                Add Team
              </Button>
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom>
            Teams
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>{team.username}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => deleteTeam(team.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Box
            sx={{
              marginBottom: "30px",
              padding: "30px",
              borderRadius: "15px",
              background: "linear-gradient(145deg, #f0f0f0, #ffffff)",
              boxShadow:
                "10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.7)",
              border: "1px solid #e6e6e6",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow:
                  "12px 12px 25px rgba(0, 0, 0, 0.15), -12px -12px 25px rgba(255, 255, 255, 0.8)",
              },
            }}
          >
            <Typography variant="h5" gutterBottom>
              Add Candidate
            </Typography>
            <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <TextField
                label="Name"
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
              <TextField
                label="Experience"
                value={newCandidate.years_of_experience}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    years_of_experience: e.target.value,
                  })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
              <TextField
                label="Skillset"
                value={newCandidate.skillset}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, skillset: e.target.value })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
              <TextField
                label="Email"
                value={newCandidate.email}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, email: e.target.value })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
              <TextField
                label="Notice Period/LWD"
                value={newCandidate.notice_period}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    notice_period: e.target.value,
                  })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />

              <TextField
                label="Current Company"
                value={newCandidate.current_company}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    current_company: e.target.value,
                  })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />

              <TextField
                label="Qualification"
                value={newCandidate.qualification}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    qualification: e.target.value,
                  })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />

              <TextField
                label="Current Location"
                value={newCandidate.current_location}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    current_location: e.target.value,
                  })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />

              <TextField
                label="Vendor"
                value={newCandidate.vendor}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, vendor: e.target.value })
                }
                variant="outlined"
                sx={{
                  flex: "1 1 300px",
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                  boxShadow:
                    "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#d6d6d6",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4a90e2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a90e2",
                      borderWidth: "2px",
                    },
                  },
                }}
              />

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, cv: e.target.files[0] })
                }
                style={{ marginTop: "10px", marginBottom: "10px" }}
              />
              {/* <Button
                variant="contained"
                color="primary"
                onClick={addCandidate}
                sx={{
                  padding: "10px 20px",
                  backgroundColor: "#F15D27",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 700,
                  borderRadius: "25px",
                  boxShadow:
                    "4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#357ABD",
                    transform: "scale(1.05)",
                    boxShadow:
                      "5px 5px 12px rgba(0, 0, 0, 0.25), -5px -5px 12px rgba(255, 255, 255, 0.6)",
                  },
                }}
              >
                Add Candidate
              </Button> */}
              <Button
                variant="contained"
                color="primary"
                onClick={editingCandidate ? handleSave : addCandidate}
                sx={{
                  padding: "10px 20px",
                  minWidth:'140px',
                  backgroundColor: editingCandidate ? "#4CAF50" : "#F15D27",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 700,
                  borderRadius: "25px",
                  boxShadow:
                    "4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: editingCandidate ? "#45A049" : "#357ABD",
                    transform: "scale(1.05)",
                    boxShadow:
                      "5px 5px 12px rgba(0, 0, 0, 0.25), -5px -5px 12px rgba(255, 255, 255, 0.6)",
                  },
                }}
              >
                {addCandidateLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : editingCandidate ? "Save Changes" : "Add Candidate"}
              </Button>
            </Box>
          </Box>

          <Box sx={{ marginBottom: "20px" ,backgroundColor:'white',borderRadius:'12px',border:'none'}}>
            <TextField
              variant="outlined"
              placeholder="Search candidates..."
              fullWidth
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* <SearchIcon /> */}
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography variant="h5" gutterBottom>
            Candidates
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Skillset</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Current Company</TableCell>
                  <TableCell>Current Location</TableCell>
                  <TableCell>Qualification</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.id}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.years_of_experience}</TableCell>
                    <TableCell>{candidate.skillset}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.vendor}</TableCell>
                    <TableCell>{candidate.current_company}</TableCell>
                    <TableCell>{candidate.current_location}</TableCell>
                    <TableCell>{candidate.qualification}</TableCell>
                    <TableCell>
                      <div>Status: {candidate.status}</div>
                      {candidate.rejection_comments && (
                        <div>
                          {candidate.rejection_comments.map(
                            (comment, index) => (
                              <>
                                <h4>Rejection Comments</h4>
                                <div key={index}>
                                  <strong>Team: {comment.team.name}</strong>
                                  <p>Comment: {comment.comment}</p>
                                  <small>
                                    Created At:{" "}
                                    {new Date(
                                      comment.created_at
                                    ).toLocaleString()}
                                  </small>
                                </div>
                              </>
                            )
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => deleteCandidate(candidate.id)}
                        sx={{color:'#FF8734'}}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEditCandidate(candidate)}
                        sx={{color:'#FF8734'}}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            // className={styles.custom_pagination}
          />
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;
