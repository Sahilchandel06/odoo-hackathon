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
    request.isOverdue && request.status !== "Repaired" && request.status !== "Scrap";

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Request detail</h1>
        <p className="page-subtitle">
          Manage the lifecycle, duration and status of this maintenance job.
        </p>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="card-header">
          <div>
            <div className="card-header-title">{request.subject}</div>
            <div className="card-header-subtitle">
              {request.type} · {request.equipment?.name || "No equipment"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--text-soft)" }}>Status</div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{request.status}</div>
          </div>
        </div>

        <div className="card-body">
          {/* Top info grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <InfoBlock
              label="Equipment"
              value={request.equipment?.name || "Not set"}
            />
            <InfoBlock
              label="Location"
              value={request.equipment?.location || "Not set"}
            />
            <InfoBlock
              label="Department"
              value={request.equipment?.department || "Not set"}
            />
            <InfoBlock
              label="Scheduled date"
              value={
                request.scheduledDate
                  ? new Date(request.scheduledDate).toLocaleString()
                  : "Not scheduled"
              }
            />
          </div>

          {/* Duration */}
          <div className="form-group" style={{ maxWidth: 220 }}>
            <label className="form-label">Hours spent (for repaired jobs)</label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 2.5"
            />
          </div>

          {/* Status buttons */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateStatus(s)}
                className={
                  "btn " +
                  (request.status === s ? "btn-primary" : "btn-outline")
                }
                disabled={savingStatus}
              >
                {s}
              </button>
            ))}
          </div>

          {overdue && (
            <div
              style={{
                marginTop: 12,
                fontSize: 11,
                color: "#fecaca",
                backgroundColor: "var(--danger-soft)",
                border: "1px solid rgba(248,113,113,0.5)",
                borderRadius: 8,
                padding: "6px 8px",
              }}
            >
              This request is overdue. Consider prioritizing or rescheduling it.
            </div>
          )}
        </div>
      </div>
    </div>
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
    <div
      style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}
    >
      {label}
    </div>
    <div>{value}</div>
  </div>
);

export default RequestDetailPage;
