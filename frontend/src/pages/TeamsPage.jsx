// TeamsPage.jsx
import { useEffect, useState } from "react";
import api from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Stack,
  Paper,
  Fade,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  Group,
  Engineering,
  LocationOn,
  Business,
} from "@mui/icons-material";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teams").then((res) => {
      setTeams(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Fade in timeout={300}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress size={36} />
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={300}>
      <Box>
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Teams & Departments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Maintenance teams organized by department and location
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {teams.map((team) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={team._id}>
              <Card
                elevation={10}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  border: "1px solid rgba(31,41,55,0.8)",
                  backdropFilter: "blur(12px)",
                  bgcolor: "rgba(11,18,32,0.95)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 28px 60px rgba(15,23,42,0.9)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "primary.main",
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {team.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {team.name}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          icon={<Group />}
                          label={`${team.members?.length || 0} members`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                        <Chip
                          icon={<Engineering />}
                          label={`${team.equipmentCount || 0} equipment`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Department
                    </Typography>
                    <Chip
                      icon={<Business />}
                      label={team.department || "General Maintenance"}
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Location
                    </Typography>
                    <Chip
                      icon={<LocationOn />}
                      label={team.location || "Main Facility"}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Active requests: <strong>{team.activeRequests || 0}</strong>
                    </Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      View Team
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {teams.length === 0 && (
          <Card
            elevation={12}
            sx={{
              borderRadius: 4,
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(31,41,55,0.8)",
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <Group sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No teams yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first maintenance team to get started.
              </Typography>
              <Button variant="contained" sx={{ borderRadius: 2 }}>
                Create Team
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Fade>
  );
};

export default TeamsPage;
