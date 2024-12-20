import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import axios from "axios";

const CandidateScreen = () => {
  const { id } = useParams();
  console.log(id, "usdfsdf");
  const [selectedSlots, setSelectedSlots] = useState({});
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [candidateName, setCandidateName] = useState("");

  const timeSlots = [
    "1st half",
    "2nd half",
    "Any Time of the day",
    "7:30 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
  ];

  const today = dayjs();
  const weekEnd = today.add(7, "day"); // Current date + 7 days restriction

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    currentWeek.startOf("week").add(i, "day")
  );

  const handleSlotSelect = (date, slot) => {
    const dateKey = date.format("YYYY-MM-DD");
    // Prevent selecting slots on invalid dates
    if (date.isBefore(today) || date.isAfter(weekEnd)) {
      alert("Slots can only be selected from today up to 1 week ahead.");
      return;
    }

    setSelectedSlots((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.includes(slot)
        ? prev[dateKey].filter((s) => s !== slot) // Deselect
        : [...(prev[dateKey] || []), slot], // Select
    }));
  };

  const handleWeekChange = (direction) => {
    const newWeek =
      direction === "next"
        ? currentWeek.add(7, "day")
        : currentWeek.subtract(7, "day");
    if (newWeek.isBefore(today.startOf("week"))) {
      alert("Cannot navigate to previous weeks.");
      return;
    }
    if (newWeek.isAfter(weekEnd)) {
      alert("Cannot navigate beyond the allowed range of 1 week.");
      return;
    }
    setCurrentWeek(newWeek);
  };

  const handleSubmit = async() => {
    if (!candidateName) {
      alert("Please enter the candidate's name.");
      return;
    }

    // const result = {
    // //   name: candidateName,
    //     candidate:id,
    //     selectedSlots,
    // };
    const result = {
        candidate: id,
        ...selectedSlots||[].reduce((acc, slot) => {
          const date = slot.date;
          if (!acc[date]) acc[date] = [];
          acc[date].push(slot.time);
          return acc;
        }, {}),
      };
    console.log(result,'aresult');
    // alert(JSON.stringify(result, null, 2));
    try {
        // POST the data to the Django API
        const response = await axios.post(
          "http://localhost:8000/candidates/time-slots/bulk-schedule/",
          result,
          {
            headers: {
              "Content-Type": "application/json",
              // If you need authentication headers, add them here (e.g., Bearer token)
            },
          }
        );
  
        if (response.status === 201) {
          alert("Time slots successfully scheduled.");
        //   setOpenSnackbar(true);
        } else {
          alert("Failed to schedule time slots.");
        }
      } catch (error) {
        console.error("Error posting time slots:", error);
        alert("An error occurred while scheduling time slots.");
      }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {/* Month and Week Navigation */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button onClick={() => handleWeekChange("prev")}>&lt;</Button>
        <Typography variant="h5">{currentWeek.format("MMMM YYYY")}</Typography>
        <Button onClick={() => handleWeekChange("next")}>&gt;</Button>
      </Box>

      {/* Candidate Name Field */}
      <Box mb={3}>
        <TextField
          fullWidth
          label="Candidate Name"
          variant="outlined"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />
      </Box>

      {/* Week Days */}
      <Grid container spacing={2}>
        {weekDays.map((date) => {
          const isDisabled = date.isBefore(today) || date.isAfter(weekEnd);
          return (
            <Grid item xs={12} sm={6} md={2} key={date}>
              <Paper
                elevation={3}
                sx={{
                  textAlign: "center",
                  padding: 2,
                  backgroundColor: isDisabled
                    ? "#f0f0f0" // Grey out past or invalid dates
                    : selectedDate.format("YYYY-MM-DD") ===
                      date.format("YYYY-MM-DD")
                    ? "#E3F2FD"
                    : "white",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (isDisabled) {
                    alert(
                      "You can only select dates from today up to 1 week ahead."
                    );
                    return;
                  }
                  setSelectedDate(date);
                }}
              >
                <Typography
                  variant="h6"
                  color={isDisabled ? "text.secondary" : "primary"}
                >
                  {date.format("ddd, D")}
                </Typography>
                <Typography variant="body2">
                  {selectedSlots[date.format("YYYY-MM-DD")]?.length || 0} slots
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Time Slots */}
      <Typography
        variant="h6"
        sx={{ marginTop: 4, textAlign: "center", fontWeight: "bold" }}
      >
        Available Time Slots ({selectedDate.format("dddd, MMM D")})
      </Typography>

      <Grid container spacing={2} justifyContent="center" mt={2}>
        {timeSlots.map((slot) => (
          <Grid item key={slot}>
            <Button
              variant={
                selectedSlots[selectedDate.format("YYYY-MM-DD")]?.includes(slot)
                  ? "contained"
                  : "outlined"
              }
              onClick={() => handleSlotSelect(selectedDate, slot)}
              disabled={
                selectedDate.isBefore(today) || selectedDate.isAfter(weekEnd)
              }
              sx={{
                padding: "10px 20px",
                minWidth: "120px",
              }}
            >
              {slot}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Submit Button */}
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            padding: "10px 20px",
            background: "linear-gradient(to right, #3f51b5, #1e88e5)",
            "&:hover": {
              background: "linear-gradient(to right, #1e88e5, #3f51b5)",
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default CandidateScreen;
