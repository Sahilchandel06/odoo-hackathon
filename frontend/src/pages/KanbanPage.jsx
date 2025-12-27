import { useEffect, useState } from "react";
import api from "../api";

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

  const handleDrop = async (e, status) => {
    const id = e.dataTransfer.getData("id");
    if (!id) return;
    await api.patch(`/requests/${id}`, { status });
    load();
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Maintenance Kanban</h1>
        <p className="page-subtitle">
          Grouped by stage. Drag cards to move requests through their lifecycle.
        </p>
      </div>

      <div className="kanban-board">
        {STAGES.map((stage) => {
          const items = requests.filter((r) => r.status === stage.key);
          return (
            <KanbanColumn
              key={stage.key}
              stage={stage}
              items={items}
              loading={loading}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
          );
        })}
      </div>
    </div>
  );
};

export default KanbanPage;

/* ----- Column component ----- */

const KanbanColumn = ({ stage, items, loading, onDrop, onDragStart }) => (
  <div
    className="kanban-column card"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => onDrop(e, stage.key)}
  >
    <div className="kanban-column-header">
      <div className="kanban-column-title">{stage.label}</div>
      <div className="kanban-column-count">{items.length}</div>
    </div>
    <div className="kanban-column-body">
      {loading && !items.length && (
        <div className="kanban-column-empty">Loading...</div>
      )}
      {items.map((r) => (
        <KanbanCard key={r._id} request={r} onDragStart={onDragStart} />
      ))}
      {!loading && !items.length && (
        <div className="kanban-column-empty">
          Drop requests here to set them as {stage.label}.
        </div>
      )}
    </div>
  </div>
);

/* ----- Card component ----- */

const KanbanCard = ({ request, onDragStart }) => {
  const overdue = request.isOverdue && request.status !== "Repaired";

  const initials = request.assignedTo?.name
    ? request.assignedTo.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className={"kanban-card" + (overdue ? " kanban-card-overdue" : "")}
      draggable
      onDragStart={(e) => onDragStart(e, request._id)}
    >
      {overdue && <div className="kanban-card-stripe" />}

      <div className="kanban-card-main-with-avatar">
        <div>
          <div className="kanban-card-title">{request.subject}</div>
          <div className="kanban-card-sub">
            {request.equipment?.name || "No equipment"}
          </div>
        </div>
        <div className="avatar">
          <span className="avatar-initials">{initials}</span>
        </div>
      </div>

      <div className="kanban-card-meta">
        <div className="kanban-card-meta-left">
          {request.equipment?.location && (
            <span>{request.equipment.location}</span>
          )}
          {request.scheduledDate && (
            <span>
              Scheduled:{" "}
              {new Date(request.scheduledDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span className="kanban-pill">{request.type}</span>
          {overdue && <span className="kanban-pill-danger">Overdue</span>}
        </div>
      </div>
    </div>
  );
};
