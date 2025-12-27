import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const DashboardPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("/requests").then((res) => setRequests(res.data));
  }, []);

  const counts = ["New", "In Progress", "Repaired", "Scrap"].reduce(
    (acc, s) => ({
      ...acc,
      [s]: requests.filter((r) => r.status === s).length,
    }),
    {}
  );

  const badgeForStatus = (status) => {
    if (status === "New") return "badge badge-status-new";
    if (status === "In Progress") return "badge badge-status-progress";
    if (status === "Repaired") return "badge badge-status-repaired";
    return "badge badge-status-scrap";
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <p className="page-subtitle">
          Live status of maintenance requests across all equipment.
        </p>
      </div>

      <div className="grid-4">
        {["New", "In Progress", "Repaired", "Scrap"].map((status) => (
          <div key={status} className="card-soft stat-card">
            <div className="stat-label">{status}</div>
            <div className="stat-value">{counts[status] || 0}</div>
            <div className="stat-desc">
              Requests currently in {status.toLowerCase()} stage.
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }} className="card">
        <div className="card-header">
          <div>
            <div className="card-header-title">Recent activity</div>
            <div className="card-header-subtitle">
              Newest maintenance requests and updates.
            </div>
          </div>
          <Link to="/kanban" className="btn btn-outline">
            View Kanban
          </Link>
        </div>
        <div className="card-body table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Equipment</th>
                <th>Department</th>
                <th>Status</th>
                <th>Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 10).map((r) => (
                <tr key={r._id}>
                  <td>
                    <Link to={`/requests/${r._id}`} className="link">
                      {r.subject}
                    </Link>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {r.type} maintenance
                    </div>
                  </td>
                  <td>
                    {r.equipment?.name || "-"}
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {r.equipment?.location}
                    </div>
                  </td>
                  <td>{r.equipment?.department || "-"}</td>
                  <td>
                    <span className={badgeForStatus(r.status)}>{r.status}</span>
                  </td>
                  <td>
                    {r.scheduledDate
                      ? new Date(r.scheduledDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {!requests.length && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                    No requests yet. Create your first one from the Kanban or
                    Calendar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
