// KanbanPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const KanbanPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/requests")
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load requests:", err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      New: "info",
      "In Progress": "warning",
      Repaired: "success",
      Scrap: "error",
    };
    return colors[status] || "default";
  };

  const columns = [
    { status: "New", title: "New Requests" },
    { status: "In Progress", title: "In Progress" },
    { status: "Repaired", title: "Completed" },
    { status: "Scrap", title: "Scrapped" },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Kanban Board
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track maintenance requests through workflow stages
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/requests/new"
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          New Request
        </Button>
      </Box>

      <Grid container spacing={2}>
        {columns.map((column) => {
          const columnRequests = requests.filter((r) => r.status === column.status);

          return (
            <Grid item xs={12} sm={6} md={3} key={column.status}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  minHeight: 200,
                  minWidth: 200,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {column.title}
                    </Typography>
                    <Chip
                      label={columnRequests.length}
                      size="small"
                      color={getStatusColor(column.status)}
                      sx={{ borderRadius: 1, fontWeight: 600 }}
                    />
                  </Box>

                  <Stack spacing={2} sx={{ flex: 1, overflowY: "auto" }}>
                    {columnRequests.map((request) => (
                      <Card
                        key={request._id}
                        variant="outlined"
                        component={Link}
                        to={`/requests/${request._id}`}
                        sx={{
                          textDecoration: "none",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "primary.main",
                            boxShadow: 2,
                          },
                        }}
                      >
                        <CardContent>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            {request.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            {request.equipment?.name || "Unassigned"}
                          </Typography>
                          <Stack direction="row" spacing={0.5}>
                            <Chip
                              label={request.type}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem", height: 20, borderRadius: 0.5 }}
                            />
                            {request.priority && (
                              <Chip
                                label={request.priority}
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem", height: 20, borderRadius: 0.5 }}
                              />
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}

                    {columnRequests.length === 0 && (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 4,
                          color: "text.secondary",
                        }}
                      >
                        <Typography variant="body2">No requests</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default KanbanPage;
