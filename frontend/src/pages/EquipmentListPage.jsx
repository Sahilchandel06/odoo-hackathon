// EquipmentListPage.jsx
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
} from "@mui/material";

const EquipmentListPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    api.get("/equipment").then((res) => {
      setEquipment(res.data);
      setLoading(false);
    });
  }, []);

  const statusChip = (status) => (
    <Chip
      label={status}
      size="small"
      color={status === "Active" ? "success" : "error"}
      variant="outlined"
    />
  );

  if (loading) {
    return (
      <Fade in timeout={300}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={300}>
      <Box>
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            Equipment inventory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All registered equipment across departments and locations.
          </Typography>
        </Box>

        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "rgba(15,23,42,0.95)",
          }}
        >
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {equipment
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((eq) => (
                    <TableRow
                      key={eq._id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: "rgba(15,23,42,0.9)" },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={500}>
                            {eq.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {eq._id.slice(-6)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{eq.type}</TableCell>
                      <TableCell>{eq.location}</TableCell>
                      <TableCell>{eq.department}</TableCell>
                      <TableCell>{statusChip(eq.status)}</TableCell>
                      <TableCell>
                        <Button
                          component={Link}
                          to={`/equipment/${eq._id}`}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 2, fontSize: 12 }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={equipment.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "rgba(2,6,23,0.8)",
            }}
          />
        </Paper>
      </Box>
    </Fade>
  );
};

export default EquipmentListPage;
