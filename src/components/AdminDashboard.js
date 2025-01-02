// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   TextField,
//   Typography,
//   CircularProgress,
//   Box,
//   IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Logout from "../Logout";

// const AdminDashboard = ({ setAuthenticated }) => {
//   const [teams, setTeams] = useState([]);
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newTeam, setNewTeam] = useState({
//     username: "",
//     password: "",
//     name: "",
//   });
//   const [newCandidate, setNewCandidate] = useState({
//     name: "",
//     years_of_experience: "",
//     skillset: "",
//     status: "Open",
//     cv: "",
//   });

//   const fetchAdminData = async () => {
//     try {
//       const teamResponse = await axios.get(
//         "https://candidate-management-backend-1.onrender.com/candidates/admin/teams/get-teams"
//       );
//       const candidateResponse = await axios.get(
//         "https://candidate-management-backend-1.onrender.com/candidates/admin/candidates/get-candidates"
//       );
//       setTeams(teamResponse?.data);
//       setCandidates(candidateResponse?.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching admin data:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAdminData();
//   }, []);

//   const addTeam = async () => {
//     try {
//       await axios.post(
//         "https://candidate-management-backend-1.onrender.com/candidates/admin/teams/add",
//         newTeam,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setNewTeam({ username: "", password: "", name: "" });
//       fetchAdminData();
//     } catch (error) {
//       console.error("Error adding team:", error);
//     }
//   };

//   const addCandidate = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", newCandidate.name);
//       formData.append("years_of_experience", newCandidate.years_of_experience);
//       formData.append("skillset", newCandidate.skillset);
//       formData.append("status", newCandidate.status || "Open");
//       if (newCandidate.cv) {
//         formData.append("cv", newCandidate.cv);
//       }

//       await axios.post(
//         "https://candidate-management-backend-1.onrender.com/candidates/admin/candidates/add",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setNewCandidate({
//         name: "",
//         years_of_experience: "",
//         skillset: "",
//         status: "Open",
//         cv: null,
//       });
//       fetchAdminData();
//     } catch (error) {
//       console.error("Error adding candidate:", error);
//     }
//   };

//   const deleteTeam = async (id) => {
//     try {
//       await axios.delete(
//         `https://candidate-management-backend-1.onrender.com/candidates/admin/teams/${id}/`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       fetchAdminData();
//     } catch (error) {
//       console.error("Error deleting team:", error);
//     }
//   };

//   const deleteCandidate = async (id) => {
//     try {
//       await axios.delete(
//         `https://candidate-management-backend-1.onrender.com/candidates/admin/candidates/${id}/`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       fetchAdminData();
//     } catch (error) {
//       console.error("Error deleting candidate:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         padding: "20px",
//         backgroundColor: "#e5edf5",
//         minHeight: "100vh",
//       }}
//     >
//       <Box>
//         <Typography
//           variant="h4"
//           align="center"
//           sx={{
//             marginBottom: "30px", // Space below the heading
//             fontWeight: "bold", // Bold text
//             fontSize: "42px", // Font size
//             textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)", // Soft shadow for depth
//             background: "linear-gradient(to right, #4facfe, #00f2fe)", // Gradient color
//             WebkitBackgroundClip: "text", // Clips the gradient to the text
//             color: "transparent", // Makes the text itself transparent to reveal the gradient
//             lineHeight: "50px", // Adjusts the line height for better spacing
//             padding: "10px 0", // Adds padding above and below
//           }}
//         >
//           OLVT Admin Dashboard
//         </Typography>
//         <Logout setAuthenticated={setAuthenticated} />
//       </Box>
//       {/* Add Team Section */}
//       <Box
//         sx={{
//           marginBottom: "30px",
//           padding: "30px",
//           borderRadius: "15px",
//           background: "linear-gradient(145deg, #f0f0f0, #ffffff)",
//           boxShadow:
//             "10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.7)",
//           border: "1px solid #e6e6e6",
//           transition: "all 0.3s ease-in-out",
//           "&:hover": {
//             transform: "scale(1.02)",
//             boxShadow:
//               "12px 12px 25px rgba(0, 0, 0, 0.15), -12px -12px 25px rgba(255, 255, 255, 0.8)",
//           },
//         }}
//       >
//         <Typography
//           variant="h5"
//           gutterBottom
//           sx={{
//             marginBottom: "20px",
//             fontWeight: "bold",
//             color: "#4a90e2",
//             textAlign: "center",
//             textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
//           }}
//         >
//           Add Team
//         </Typography>
//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "center",
//             gap: "15px",
//           }}
//         >
//           <TextField
//             label="Username"
//             value={newTeam.username}
//             onChange={(e) =>
//               setNewTeam({ ...newTeam, username: e.target.value })
//             }
//             variant="outlined"
//             sx={{
//               flex: "1 1 300px",
//               backgroundColor: "#ffffff",
//               borderRadius: "5px",
//               boxShadow:
//                 "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "#d6d6d6",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#4a90e2",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "#4a90e2",
//                   borderWidth: "2px",
//                 },
//               },
//             }}
//           />
//           <TextField
//             label="Password"
//             value={newTeam.password}
//             onChange={(e) =>
//               setNewTeam({ ...newTeam, password: e.target.value })
//             }
//             variant="outlined"
//             // type="password"
//             sx={{
//               flex: "1 1 300px",
//               backgroundColor: "#ffffff",
//               borderRadius: "5px",
//               boxShadow:
//                 "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "#d6d6d6",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#4a90e2",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "#4a90e2",
//                   borderWidth: "2px",
//                 },
//               },
//             }}
//           />
//           <TextField
//             label="Name"
//             value={newTeam.name}
//             onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
//             variant="outlined"
//             sx={{
//               flex: "1 1 300px",
//               backgroundColor: "#ffffff",
//               borderRadius: "5px",
//               boxShadow:
//                 "inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "#d6d6d6",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#4a90e2",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "#4a90e2",
//                   borderWidth: "2px",
//                 },
//               },
//             }}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={addTeam}
//             sx={{
//               padding: "10px 20px",
//               backgroundColor: "#4a90e2",
//               color: "#ffffff",
//               fontWeight: "bold",
//               borderRadius: "25px",
//               boxShadow:
//                 "4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.5)",
//               transition: "all 0.3s ease-in-out",
//               "&:hover": {
//                 backgroundColor: "#357ABD",
//                 transform: "scale(1.05)",
//                 boxShadow:
//                   "5px 5px 12px rgba(0, 0, 0, 0.25), -5px -5px 12px rgba(255, 255, 255, 0.6)",
//               },
//             }}
//           >
//             Add Team
//           </Button>
//         </Box>
//       </Box>

//       {/* Teams Table */}
//       <Typography variant="h5" gutterBottom>
//         Teams
//       </Typography>
//       <TableContainer
//         component={Paper}
//         sx={{
//           marginBottom: "30px",
//           borderRadius: "10px",
//           boxShadow:
//             "4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.5)",
//         }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Username</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {teams?.map((team) => (
//               <TableRow
//                 key={team.id}
//                 sx={{
//                   "&:hover": {
//                     backgroundColor: "#f1f1f1",
//                   },
//                 }}
//               >
//                 <TableCell>{team.id}</TableCell>
//                 <TableCell>{team.username}</TableCell>
//                 <TableCell>{team.name}</TableCell>
//                 <TableCell>
//                   <IconButton
//                     color="error"
//                     onClick={() => deleteTeam(team.id)}
//                     sx={{
//                       "&:hover": {
//                         transform: "scale(1.1)",
//                       },
//                     }}
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Add Candidate Section */}
//       <Box
//         sx={{
//           marginBottom: "30px",
//           padding: "20px",
//           borderRadius: "10px",
//           boxShadow:
//             "inset 4px 2px 4px 0 rgba(95, 157, 231, 0.48), inset -4px -4px 2px 0 rgba(183, 211, 244, 0.2)",
//           backgroundColor: "#ffffff",
//         }}
//       >
//         <Typography variant="h5" gutterBottom>
//           Add Candidate
//         </Typography>
//         <TextField
//           label="Name"
//           value={newCandidate.name}
//           onChange={(e) =>
//             setNewCandidate({ ...newCandidate, name: e.target.value })
//           }
//           sx={{ marginRight: "10px" }}
//         />
//         <TextField
//           label="Years of Experience"
//           value={newCandidate.years_of_experience}
//           onChange={(e) =>
//             setNewCandidate({
//               ...newCandidate,
//               years_of_experience: e.target.value,
//             })
//           }
//           sx={{ marginRight: "10px" }}
//         />
//         <TextField
//           label="Skillset"
//           value={newCandidate.skillset}
//           onChange={(e) =>
//             setNewCandidate({ ...newCandidate, skillset: e.target.value })
//           }
//           sx={{ marginRight: "10px" }}
//         />
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={(e) =>
//             setNewCandidate({ ...newCandidate, cv: e.target.files[0] })
//           }
//           style={{ marginTop: "10px", marginBottom: "10px" }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={addCandidate}
//           sx={{
//             marginLeft: "10px",
//             "&:hover": {
//               transform: "scale(1.05)",
//               boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//             },
//           }}
//         >
//           Add Candidate
//         </Button>
//       </Box>

//       {/* Candidates Table */}
//       <Typography variant="h5" gutterBottom>
//         Candidates
//       </Typography>
//       <TableContainer
//         component={Paper}
//         sx={{
//           borderRadius: "10px",
//           boxShadow:
//             "4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.5)",
//         }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Years of Experience</TableCell>
//               <TableCell>Skillset</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {candidates?.map((candidate) => (
//               <TableRow
//                 key={candidate.id}
//                 sx={{
//                   "&:hover": {
//                     backgroundColor: "#f1f1f1",
//                   },
//                 }}
//               >
//                 <TableCell>{candidate.id}</TableCell>
//                 <TableCell>{candidate.name}</TableCell>
//                 <TableCell>{candidate.years_of_experience}</TableCell>
//                 <TableCell>{candidate.skillset}</TableCell>
//                 <TableCell>
//                   <div>Status: {candidate.status}</div>
//                   {candidate.rejection_comments && (
//                     <div>
//                       {candidate.rejection_comments.map((comment, index) => (
//                         <>
//                           <h4>Rejection Comments</h4>
//                           <div key={index}>
//                             <strong>Team: {comment.team.name}</strong>
//                             <p>Comment: {comment.comment}</p>
//                             <small>
//                               Created At:{" "}
//                               {new Date(comment.created_at).toLocaleString()}
//                             </small>
//                           </div>
//                         </>
//                       ))}
//                     </div>
//                   )}
//                 </TableCell>

//                 <TableCell>
//                   <IconButton
//                     color="error"
//                     onClick={() => deleteCandidate(candidate.id)}
//                     sx={{
//                       "&:hover": {
//                         transform: "scale(1.1)",
//                       },
//                     }}
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default AdminDashboard;

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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Logout from "../Logout";

const AdminDashboard = ({ setAuthenticated }) => {
  const [teams, setTeams] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // State for managing tabs
  const [newTeam, setNewTeam] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    years_of_experience: "",
    skillset: "",
    status: "Open",
    cv: null,
    notice_period: "",
    current_company: "",
    qualification: "",
    current_location: "",
    vendor: "OLVT",
  });

  const fetchAdminData = async () => {
    try {
      const teamResponse = await axios.get(
        "https://candidate-management-backend-1.onrender.com/candidates/admin/teams/get-teams"
      );
      const candidateResponse = await axios.get(
        "https://candidate-management-backend-1.onrender.com/candidates/admin/candidates/get-candidates"
      );
      setTeams(teamResponse?.data);
      setCandidates(candidateResponse?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setLoading(false);
    }
  };

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
      setNewTeam({ username: "", password: "", name: "" });
      fetchAdminData();
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  const addCandidate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newCandidate.name);
      formData.append("years_of_experience", newCandidate.years_of_experience);
      formData.append("skillset", newCandidate.skillset);
      formData.append("status", newCandidate.status || "Open");
      formData.append("notice_period", newCandidate.notice_period);
      formData.append("current_company", newCandidate.current_company);
      formData.append("qualification", newCandidate.qualification);
      formData.append("current_locatinon", newCandidate.current_location);
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
        status: "Open",
        cv: null,
        notice_period:"",
        current_company:"",
        qualification:"",
        current_location:"",
        vendor: "OLVT",
      });
      fetchAdminData();
    } catch (error) {
      console.error("Error adding candidate:", error);
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
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#e5edf5",
        // minHeight: "100vh",
        paddingTop:'0px'
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
                  color: "#e8553e",
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
                display:'flex',
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
              <Button
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
              </Button>
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom>
            Candidates
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Skillset</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Current Company</TableCell>
                  <TableCell>Current Location</TableCell>
                  <TableCell>Qualification</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.years_of_experience}</TableCell>
                    <TableCell>{candidate.skillset}</TableCell>
                    <TableCell>{candidate.vendor}</TableCell>
                    <TableCell>{candidate.current_company}</TableCell>
                    <TableCell>{candidate.current_location}</TableCell>
                    <TableCell>{candidate.qualification}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => deleteCandidate(candidate.id)}
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
    </Box>
  );
};

export default AdminDashboard;
