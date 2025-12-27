import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api";

const EquipmentRequestsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [eqRes, reqRes] = await Promise.all([
        api.get("/equipment"),
        api.get(`/equipment/${id}/requests`),
      ]);

      const eq = eqRes.data.find((e) => e._id === id) || null;
      setEquipment(eq);
      setRequests(reqRes.data);
      setLoading(false);
    };
    load();
  }, [id]);

  const openCount = requests.filter(
    (r) => r.status !== "Repaired" && r.status !== "Scrap"
  ).length;

  const badgeForStatus = (status) => {
    if (status === "New") return "badge badge-status-new";
    if (status === "In Progress") return "badge badge-status-progress";
    if (status === "Repaired") return "badge badge-status-repaired";
    return "badge badge-status-scrap";
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Equipment maintenance</h1>
        <p className="page-subtitle">
          All maintenance requests linked to this specific machine.
        </p>
      </div>

      {equipment && (
        <div
          className="card-soft"
          style={{
            padding: 14,
            marginBottom: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {equipment.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {equipment.department || "No department"} ·{" "}
              {equipment.location || "No location"}
            </div>
            {equipment.serialNumber && (
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                SN: {equipment.serialNumber}
              </div>
            )}
            {equipment.isScrapped && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  color: "#fecaca",
                  backgroundColor: "var(--danger-soft)",
                  border: "1px solid rgba(248,113,113,0.5)",
                  borderRadius: 8,
                  padding: "4px 8px",
                  maxWidth: 320,
                }}
              >
                This equipment has been marked as scrapped and is no longer
                usable.
              </div>
            )}
          </div>

          {/* Smart badge */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--text-soft)" }}>
              Open requests
            </div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{openCount}</div>
            <div style={{ marginTop: 8 }}>
              <button
                className="btn btn-outline"
                onClick={() => navigate("/requests/new")}
              >
                + New request
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-header-title">Maintenance requests</div>
            <div className="card-header-subtitle">
              Corrective and preventive jobs for this equipment only.
            </div>
          </div>
        </div>
        <div className="card-body table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Type</th>
                <th>Status</th>
                <th>Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} style={{ padding: 20 }}>
                    Loading requests...
                  </td>
                </tr>
              )}
              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 20 }}>
                    No requests for this equipment yet.
                  </td>
                </tr>
              )}
              {!loading &&
                requests.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <Link to={`/requests/${r._id}`} className="link">
                        {r.subject}
                      </Link>
                    </td>
                    <td>{r.type}</td>
                    <td>
                      <span className={badgeForStatus(r.status)}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.scheduledDate
                        ? new Date(r.scheduledDate).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquipmentRequestsPage;
