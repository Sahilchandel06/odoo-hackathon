  // EquipmentRequestsPage.jsx
  import { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import api from "../api";
  import {
    Box,
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    CircularProgress,
    Stack,
    Button,
    TextField,
    InputAdornment,
  } from "@mui/material";
  import {
    Search,
    Add,
    Visibility,
  } from "@mui/icons-material";

  const EquipmentRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");

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

    const filteredRequests = requests.filter(
      (r) =>
        r.subject?.toLowerCase().includes(search.toLowerCase()) ||
        r.equipment?.name?.toLowerCase().includes(search.toLowerCase())
    );

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
              Maintenance Requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All equipment maintenance requests across departments
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

        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search by subject or equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 400,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                bgcolor: "background.paper",
              },
            }}
          />
        </Box>

        <Card elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "background.paper" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Equipment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Scheduled</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow
                      key={request._id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:last-child td": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {request.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {request._id?.slice(-6)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.equipment?.name || "Unassigned"}
                        </Typography>
                        {request.equipment?.location && (
                          <Typography variant="caption" color="text.secondary">
                            {request.equipment.location}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.type}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          size="small"
                          color={getStatusColor(request.status)}
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.scheduledDate
                            ? new Date(request.scheduledDate).toLocaleDateString()
                            : "Not scheduled"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          component={Link}
                          to={`/requests/${request._id}`}
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No requests found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {search
                          ? "Try adjusting your search"
                          : "Create your first maintenance request"}
                      </Typography>
                      {!search && (
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
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredRequests.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          />
        </Card>
      </Box>
    );
  };

  export default EquipmentRequestsPage;
