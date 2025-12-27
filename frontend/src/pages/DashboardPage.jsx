// DashboardPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Stack,
  Fade,
} from "@mui/material";

const DashboardPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("/requests").then((res) => setRequests(res.data));
  }, []);

  const counts = ["New", "In Progress", "Repaired", "Scrap"].reduce(
    (acc, s) => ({
      ...acc,
      [s]: requests.filter((r) => r.status === s).length,
    }),
    {}
  );

  const chipForStatus = (status) => {
    if (status === "New")
      return <Chip label="New" size="small" color="info" variant="outlined" />;
    if (status === "In Progress")
      return (
        <Chip label="In Progress" size="small" color="warning" variant="outlined" />
      );
    if (status === "Repaired")
      return (
        <Chip label="Repaired" size="small" color="success" variant="outlined" />
      );
    return <Chip label="Scrap" size="small" color="error" variant="outlined" />;
  };

  return (
    <Fade in timeout={300}>
      <Box>
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            Live status overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time summary of maintenance requests across all equipment.
          </Typography>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2} mb={3}>
          {["New", "In Progress", "Repaired", "Scrap"].map((status) => (
            <Grid item xs={12} sm={6} md={3} key={status}>
              <Card
                elevation={6}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      status === "New"
                        ? "linear-gradient(135deg, rgba(56,189,248,0.12), transparent)"
                        : status === "In Progress"
                        ? "linear-gradient(135deg, rgba(251,191,36,0.12), transparent)"
                        : status === "Repaired"
                        ? "linear-gradient(135deg, rgba(34,197,94,0.15), transparent)"
                        : "linear-gradient(135deg, rgba(248,113,113,0.12), transparent)",
                    opacity: 1,
                    pointerEvents: "none",
                  },
                }}
              >
                <CardContent sx={{ position: "relative" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase" }}
                  >
                    {status}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.5 }}>
                    {counts[status] || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {status === "New" && "Requests waiting to be triaged"}
                    {status === "In Progress" && "Work currently in progress"}
                    {status === "Repaired" && "Successfully repaired equipment"}
                    {status === "Scrap" && "Marked for replacement or scrap"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Table */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "rgba(15,23,42,0.95)",
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={500}>
                Recent requests
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Latest maintenance activity across departments
              </Typography>
            </Box>
            <Typography
              component={Link}
              to="/requests"
              variant="caption"
              sx={{ color: "primary.main", textDecoration: "none" }}
            >
              View all
            </Typography>
          </Box>
          <TableContainer sx={{ maxHeight: 420 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell>Equipment</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Scheduled</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No requests yet. Create your first one from the Kanban or
                        Calendar.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.slice(0, 10).map((r) => (
                    <TableRow
                      key={r._id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "rgba(15,23,42,0.9)",
                        },
                      }}
                      component={Link}
                      to={`/requests/${r._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <TableCell>
                        {r.subject} {r.type} maintenance
                      </TableCell>
                      <TableCell>
                        {r.equipment?.name || "-"}{" "}
                        {r.equipment?.location ? `• ${r.equipment.location}` : ""}
                      </TableCell>
                      <TableCell>{r.equipment?.department || "-"}</TableCell>
                      <TableCell>{chipForStatus(r.status)}</TableCell>
                      <TableCell>
                        {r.scheduledDate
                          ? new Date(r.scheduledDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Fade>
  );
};

export default DashboardPage;
