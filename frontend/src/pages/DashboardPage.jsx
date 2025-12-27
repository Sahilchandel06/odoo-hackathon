// DashboardPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  PrecisionManufacturing,
  RequestQuote,
  Group,
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
} from "@mui/icons-material";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    activeRequests: 0,
    completedRequests: 0,
    teams: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/equipment"),
      api.get("/requests"),
      api.get("/teams"),
    ])
      .then(([equipmentRes, requestsRes, teamsRes]) => {
        const activeRequests = requestsRes.data.filter(
          (r) => r.status === "New" || r.status === "In Progress"
        );
        const completedRequests = requestsRes.data.filter(
          (r) => r.status === "Repaired"
        );

        setStats({
          totalEquipment: equipmentRes.data.length,
          activeRequests: activeRequests.length,
          completedRequests: completedRequests.length,
          teams: teamsRes.data.length,
        });

        setRecentRequests(requestsRes.data.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time maintenance operations and equipment status
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              minHeight: 140,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    Total Equipment
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.totalEquipment}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "#fff",
                    borderRadius: 2,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                    minHeight: 48,
                  }}
                >
                  <PrecisionManufacturing sx={{ fontSize: 28 }} />
                </Box>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ mt: 2, borderRadius: 1, height: 6 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              minHeight: 140,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    Active Requests
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.activeRequests}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "warning.main",
                    color: "#fff",
                    borderRadius: 2,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                    minHeight: 48,
                  }}
                >
                  <Warning sx={{ fontSize: 28 }} />
                </Box>
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block" }}
              >
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              minHeight: 140,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    Completed
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.completedRequests}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "success.main",
                    color: "#fff",
                    borderRadius: 2,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                    minHeight: 48,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 28 }} />
                </Box>
              </Stack>
              <Typography
                variant="caption"
                color="success.main"
                fontWeight={600}
                sx={{ mt: 2, display: "block" }}
              >
                +12% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              minHeight: 140,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    Teams
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.teams}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "info.main",
                    color: "#fff",
                    borderRadius: 2,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                    minHeight: 48,
                  }}
                >
                  <Group sx={{ fontSize: 28 }} />
                </Box>
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block" }}
              >
                Active maintenance teams
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Requests */}
      <Card elevation={2}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6" fontWeight={600}>
              Recent Maintenance Requests
            </Typography>
            <Chip
              label="View All"
              component={Link}
              to="/requests"
              clickable
              size="small"
              sx={{ borderRadius: 1 }}
            />
          </Box>

          <Stack spacing={2}>
            {recentRequests.map((request) => (
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
                    transform: "translateX(4px)",
                  },
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box flex={1}>
                      <Typography variant="body1" fontWeight={600} gutterBottom>
                        {request.subject}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {request.equipment?.name || "Unassigned"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.type}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={request.status}
                      size="small"
                      color={getStatusColor(request.status)}
                      sx={{ borderRadius: 1 }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}

            {recentRequests.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  No recent requests
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
