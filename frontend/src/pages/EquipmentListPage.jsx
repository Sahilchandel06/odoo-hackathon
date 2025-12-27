// EquipmentListPage.jsx
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
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Add, Visibility } from "@mui/icons-material";

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

  const getStatusColor = (status) => {
    const colors = {
      Active: "success",
      Maintenance: "warning",
      Inactive: "error",
      Scrapped: "default",
    };
    return colors[status] || "default";
  };

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
            Equipment Inventory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All registered equipment across departments and locations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/equipment/new"
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add Equipment
        </Button>
      </Box>

      <Card elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "background.paper" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Serial Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
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
                      "&:last-child td": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {eq.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {eq._id?.slice(-6)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{eq.serialNumber || "—"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{eq.location || "—"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{eq.department || "—"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={eq.isScrapped ? "Scrapped" : "Active"}
                        size="small"
                        color={eq.isScrapped ? "default" : "success"}
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        to={`/equipment/${eq._id}`}
                        size="small"
                        sx={{ color: "primary.main" }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
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
          }}
        />
      </Card>

      {equipment.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No equipment found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Start by adding your first equipment item
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/equipment/new"
            sx={{ borderRadius: 1.5, textTransform: "none", fontWeight: 600 }}
          >
            Add Equipment
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EquipmentListPage;
