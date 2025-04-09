import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";

const sections = [
  { id: "edit", label: "Edit Logo" },
  { id: "edit-1", label: "Edit Information" },

  { id: "edit-discount", label: "Edit Discount" },
  { id: "edit-package-1", label: "GYM PER SESSION" },
  { id: "edit-package-2", label: "GYM MONTHLY" },
  { id: "edit-package-10", label: "GYM+TREDAMILL   " },
  { id: "edit-package-3", label: "MONTHLY TREADMILL" },
  { id: "edit-package-4", label: "P.I PER SESSION" },
  { id: "edit-package-5", label: "P.I MONTHLY" },
  { id: "edit-package-6", label: "ZUMBA" },
  { id: "edit-package-7", label: "DANCE STUDIO" },
  { id: "edit-package-8", label: "TAEKWANDO" },
  { id: "edit-package-9", label: "MUAY THAI" },
  { id: "edit-package-10", label: "BOXING   " },
];

const servicesOffered = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleUpdateSuccess = () => {
    showAlert(`Section successfully updated.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred!", "error");
  };

  const [selectedSection, setSelectedSection] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [plan, setPlan] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState([]);
  const [exerciseId, setExerciseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchExercises();
    }
  }, [authToken, navigate]);

  const fetchExercises = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-exercise",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setExercises(response.data.data);
        console.log(response.data.data);
      } else {
        console.error("Failed to fetch exercises:", response);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error.message);
    }
  };

  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);
    const selectedExercise = exercises.find(
      (exercise) => exercise.id === sectionId
    );

    if (selectedExercise) {
      setExerciseId(selectedExercise.id);
      setPrice(selectedExercise.price || "");
      setName(selectedExercise.name || "");
      setPlan(selectedExercise.tag || "session");
      setDescription(selectedExercise.short_description || "");
    } else {
      setExerciseId(null);
      setPrice("");
      setPlan("");
      setName("");
      setDescription("");
    }
    setImage(null);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpdate = async () => {
    const endpoint = exerciseId
      ? `http://localhost:8000/api/admin/update-exercise/${exerciseId}`
      : "http://localhost:8000/api/admin/store-exercise";

    const payload = {
      name,
      price,
      tag: plan,
      short_description: description,
    };

    setIsLoading(true);
    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        fetchExercises();
        handleUpdateSuccess();
        setIsLoading(false);
      } else {
        console.error(
          `Failed to ${exerciseId ? "update" : "create"} exercise:`,
          response
        );
        handleError();
        setIsLoading(false);
      }
    } catch (error) {
      console.error(
        `Error ${exerciseId ? "updating" : "creating"} exercise:`,
        error.message
      );
      handleError();
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Header
        title="Services Offered"
        subtitle="Manage Discounts and Packages"
      />

      {/* Section Selection Buttons */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select a Section to Edit
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            {" "}
            <Button
              variant="contained"
              color={exerciseId ? "inherit" : "secondary"}
              onClick={() => handleSectionSelect(null)}
              disabled={isLoading}
            >
              Create New
            </Button>
          </Grid>

          {exercises.map((section) => (
            <Grid item key={section.id}>
              <Button
                variant="contained"
                color={selectedSection === section.id ? "info" : "primary"}
                onClick={() => handleSectionSelect(section.id)}
                disabled={isLoading}
              >
                {section.label || section.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dynamic Section Editor */}
      <Paper
        elevation={3}
        sx={{ padding: 3, backgroundColor: colors.primary[400] }}
      >
        <Typography variant="h6" gutterBottom>
          {exercises.find((section) => section.id === selectedSection)?.name ||
            "Section"}
        </Typography>

        {/* Image Input */}
        {/*<Grid container spacing={2} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              Please upload an image (.jpg, .png only)
            </Typography>
            <input
              type="file"
              accept=".jpg,.png"
              onChange={handleImageChange}
              aria-label="Upload image"
            />
          </Grid>
        </Grid>*/}

        {!exerciseId && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
        )}

        {/* Price Input */}
        <Grid container spacing={2} marginTop={0.125}>
          <Grid item xs={12}>
            <TextField
              label="Price"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Plan Input */}
        <Grid container spacing={2} marginTop={0.125}>
          <Grid item xs={12}>
            <TextField
              select
              label="Plan"
              fullWidth
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="session">Session</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Description Input */}
        <Grid container spacing={2} marginTop={0.125}>
          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Action Button */}
        <Grid
          container
          spacing={2}
          sx={{ marginTop: 3 }}
          justifyContent="flex-end"
        >
          <Button
            disabled={isLoading}
            variant="contained"
            color="primary"
            onClick={handleUpdate}
          >
            {exerciseId ? "Update" : "Create"}
          </Button>
        </Grid>
      </Paper>
    </Box>
  );
};

export default servicesOffered;
