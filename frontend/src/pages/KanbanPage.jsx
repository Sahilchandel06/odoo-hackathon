// KanbanPage.jsx
import { useEffect, useState, useMemo } from "react";
import api from "../api";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Fade,
  Stack,
} from "@mui/material";
import KanbanColumn from "../components/KanbanColumn";

const STAGES = [
  { key: "New", label: "New" },
  { key: "In Progress", label: "In Progress" },
  { key: "Repaired", label: "Repaired" },
  { key: "Scrap", label: "Scrap" },
];

const KanbanPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/requests");
    setRequests(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const base = {
      New: [],
      "In Progress": [],
      Repaired: [],
      Scrap: [],
    };
    requests.forEach((r) => {
      const s = r.status || "New";
      base[s] = [...(base[s] || []), r];
    });
    return base;
  }, [requests]);

  return (
    <Fade in timeout={300}>
      <Box>
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            Kanban board
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop requests between stages to control the full lifecycle.
          </Typography>
        </Box>

        {loading ? (
          <Box
            sx={{
              minHeight: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={28} />
              <Typography variant="body2" color="text.secondary">
                Loading requests…
              </Typography>
            </Stack>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {STAGES.map((s) => (
              <Grid item xs={12} sm={6} md={3} key={s.key}>
                <Card
                  elevation={6}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "rgba(15,23,42,0.96)",
                    borderRadius: 3,
                    overflow: "hidden",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(31,41,55,0.9)",
                  }}
                >
                  <CardContent
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pb: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: 13, fontWeight: 600 }}
                      >
                        {s.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: 11 }}
                      >
                        Stage in the maintenance pipeline
                      </Typography>
                    </Box>
                    <Chip
                      label={`${grouped[s.key]?.length || 0}`}
                      size="small"
                      color={
                        s.key === "New"
                          ? "info"
                          : s.key === "In Progress"
                          ? "warning"
                          : s.key === "Repaired"
                          ? "success"
                          : "error"
                      }
                      variant="outlined"
                      sx={{ fontSize: 11 }}
                    />
                  </CardContent>

                  <Box
                    sx={{
                      flex: 1,
                      p: 1.5,
                      overflowY: "auto",
                    }}
                  >
                    <KanbanColumn
                      stage={s.key}
                      requests={grouped[s.key] || []}
                      onStatusChange={async (id, status) => {
                        await api.patch(`/requests/${id}`, { status });
                        load();
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Fade>
  );
};

export default KanbanPage;
