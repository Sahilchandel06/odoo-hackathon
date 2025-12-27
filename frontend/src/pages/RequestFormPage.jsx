// RequestFormPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Typography,
  Fade,
  Grid,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const RequestFormPage = () => {
  const [formData, setFormData] = useState({
    subject: "",
    type: "",
    equipmentId: "",
    description: "",
    priority: "Medium",
    scheduledDate: "",
    isUrgent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await api.post("/requests", formData);
      navigate("/requests");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Fade in timeout={400}>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Box mb={3}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            New Maintenance Request
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill out details for equipment maintenance or repair
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Card elevation={2}>
          <CardContent sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Subject */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Brief description of the issue"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        "& input": {
                          color: "text.primary",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Equipment */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Equipment ID"
                    name="equipmentId"
                    value={formData.equipmentId}
                    onChange={handleChange}
                    placeholder="e.g., EQ-001"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        "& input": {
                          color: "text.primary",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Request Type */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Request Type"
                    name="type"
                    select
                    value={formData.type}
                    onChange={handleChange}
                    required
                    sx={{
                      minWidth: 150,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  >
                    <MenuItem value="Corrective">Corrective</MenuItem>
                    <MenuItem value="Preventive">Preventive</MenuItem>
                  </TextField>
                </Grid>

                {/* Priority */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Priority"
                    name="priority"
                    select
                    value={formData.priority}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </TextField>
                </Grid>

                {/* Scheduled Date */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Scheduled Date"
                    name="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        "& input": {
                          color: "text.primary",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Urgent Checkbox */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isUrgent}
                        onChange={handleChange}
                        name="isUrgent"
                        sx={{ 
                          color: "warning.main", 
                          "&.Mui-checked": { color: "warning.main" } 
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          Mark as Urgent
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Requires immediate attention
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide detailed information about the maintenance request..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        "& textarea": {
                          color: "text.primary",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Submit Button - Outside Card */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/requests")}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 1.5,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              flex: 2,
              py: 1.5,
              borderRadius: 1.5,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "Create Request"
            )}
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default RequestFormPage;
