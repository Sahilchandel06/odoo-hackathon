// EquipmentRequestsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Paper,
  Fade,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import {
  FilterList,
  Search,
  Add as AddIcon,
} from "@mui/icons-material";

const statusChip = (status) => {
  const colors = {
    New: "info",
    "In Progress": "warning",
    Repaired: "success",
    Scrap: "error",
  };
  return (
    <Chip
      label={status}
      size="small"
      color={colors[status] || "default"}
      variant="outlined"
      sx={{ fontSize: 11, height: 24 }}
    />
  );
};

const EquipmentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/requests").then((res) => {
      setRequests(res.data);
      setLoading(false);
    });
  }, []);

  const filteredRequests = requests.filter((r) =>
    r.subject.toLowerCase().includes(search.toLowerCase()) ||
    r.equipment?.name?.toLowerCase().includes(search.toLowerCase())
  );

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
        <Box mb={4} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Maintenance requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All equipment maintenance requests across departments
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Search />}
              sx={{ borderRadius: 2 }}
              size="small"
            >
              Filter
            </Button>
            <Button
              component={Link}
              to="/requests/new"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                boxShadow: "0 12px 30px rgba(34,197,94,0.4)",
                fontWeight: 600,
              }}
            >
              New Request
            </Button>
          </Stack>
        </Box>

        <Paper
          elevation={12}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "rgba(15,23,42,0.97)",
            border: "1px solid rgba(31,41,55,0.9)",
            backdropFilter: "blur(12px)",
          }}
        >
          <TableContainer sx={{ maxHeight: 700 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "rgba(2,6,23,0.95)" }}>Subject</TableCell>
                  <TableCell sx={{ bgcolor: "rgba(2,6,23,0.95)" }}>Equipment</TableCell>
                  <TableCell sx={{ bgcolor: "rgba(2,6,23,0.95)" }}>Department</TableCell>
                  <TableCell sx={{ bgcolor: "rgba(2,6,23,0.95)" }}>Status</TableCell>
                  <TableCell sx={{ bgcolor: "rgba(2,6,23,0.95)" }}>Priority</TableCell>
                  <TableCell sx={{ bgcolor: "rgba(2,6,23,0.95)", width: 140 }}>Scheduled</TableCell>
                  <TableCell sx={{ bgcolor: "rgba(2,6,23,0.95)" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow
                      key={request._id}
                      hover
                      component={Link}
                      to={`/requests/${request._id}`}
                      sx={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": {
                          bgcolor: "rgba(15,23,42,0.92)",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={500} noWrap>
                            {request.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.type} maintenance
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {request.equipment?.name || "Unassigned"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.equipment?.location || "-"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.equipment?.department || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>{statusChip(request.status)}</TableCell>
                      <TableCell>
                        {request.priority && (
                          <Chip
                            label={request.priority}
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ fontSize: 10, height: 22 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.scheduledDate
                            ? new Date(request.scheduledDate).toLocaleDateString()
                            : "No schedule"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 2, fontSize: 11, minWidth: 80 }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                        <Typography variant="h6" gutterBottom>
                          No requests found
                        </Typography>
                        <Typography variant="body2">
                          Create your first maintenance request or adjust your filters.
                        </Typography>
                      </Box>
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
            rowsPerPageOptions={[10, 15, 25, 50]}
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "rgba(2,6,23,0.95)",
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: "text.secondary",
              },
            }}
          />
        </Paper>
      </Box>
    </Fade>
  );
};

export default EquipmentRequestsPage;
