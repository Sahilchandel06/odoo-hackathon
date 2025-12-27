import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const STATUSES = ["New", "In Progress", "Repaired", "Scrap"];

const RequestDetailPage = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [duration, setDuration] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await api.get("/requests");
    const found = res.data.find((r) => r._id === id) || null;
    setRequest(found);
    setDuration(found?.duration || "");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const updateStatus = async (status) => {
    if (!request) return;
    setSavingStatus(true);
    await api.patch(`/requests/${id}`, { status, duration });
    setSavingStatus(false);
    load();
  };

  if (loading || !request) {
    return <div style={{ fontSize: 12 }}>Loading request...</div>;
  }

  const overdue =
    request.isOverdue &&
    request.status !== "Repaired" &&
    request.status !== "Scrap";

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5">Request #REQ-123</Typography>
        <Stack direction="row" spacing={1} mt={0.5}>
          <Chip label="In Progress" color="warning" />
          <Chip label="High Priority" color="error" />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={8} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>
                Details
              </Typography>
              {/* request details */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={8} sx={{ borderRadius: 3, height: "fit-content" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" mb={2}>
                Actions
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{ mb: 2, borderRadius: 2 }}
              >
                Move to Repaired
              </Button>
              {/* other action buttons */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const InfoBlock = ({ label, value }) => (
  <div
    style={{
      padding: 10,
      borderRadius: 10,
      backgroundColor: "var(--card-soft)",
      border: "1px solid var(--border)",
      fontSize: 12,
    }}
  >
    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
      {label}
    </div>
    <div>{value}</div>
  </div>
);

export default RequestDetailPage;
