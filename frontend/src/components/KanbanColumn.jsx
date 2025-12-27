// KanbanColumn.jsx
import { Box, Card, CardContent, Typography, Chip, Stack } from "@mui/material";

export default function KanbanColumn({ stage, requests, onStatusChange }) {
  const handleDrop = async (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    if (!id) return;
    await onStatusChange(id, stage);
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const statusChip = (status) => {
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
    <Box
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      sx={{
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        gap: 1.2,
      }}
    >
      {requests.length === 0 ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          No requests in this stage.
        </Typography>
      ) : (
        requests.map((r) => (
          <Card
            key={r._id}
            draggable
            onDragStart={(e) => handleDragStart(e, r._id)}
            elevation={8}
            sx={{
              position: "relative",
              bgcolor: "rgba(15,23,42,0.98)",
              borderRadius: 2,
              border: "1px solid rgba(31,41,55,0.9)",
              cursor: "grab",
              transition: "transform 0.12s ease, box-shadow 0.18s ease, border-color 0.18s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
                borderColor: "primary.main",
              },
              "&::before": r.status === "Scrap" || r.status === "New"
                ? {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: 2,
                    background:
                      r.status === "Scrap"
                        ? "linear-gradient(135deg, rgba(248,113,113,0.18), transparent)"
                        : "linear-gradient(135deg, rgba(56,189,248,0.16), transparent)",
                    opacity: 0.7,
                    pointerEvents: "none",
                  }
                : {},
            }}
          >
            <CardContent sx={{ position: "relative", p: 1.2 }}>
              <Stack spacing={0.5}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: 13, fontWeight: 600 }}
                >
                  {r.subject}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 11 }}
                >
                  {r.type} • {r.equipment?.name || "-"}
                  {r.equipment?.location ? ` • ${r.equipment.location}` : ""}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 0.5 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {statusChip(r.status)}
                    {r.priority && (
                      <Chip
                        label={r.priority}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: 10 }}
                      />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {r.scheduledDate
                      ? new Date(r.scheduledDate).toLocaleDateString()
                      : "No schedule"}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
