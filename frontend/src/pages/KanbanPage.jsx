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

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      "New": {
        icon: "🆕",
        color: "#3b82f6",
        glow: "rgba(59, 130, 246, 0.4)",
        gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))"
      },
      "In Progress": {
        icon: "⚙️",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.4)",
        gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))"
      },
      "Repaired": {
        icon: "✅",
        color: "#06b6d4",
        glow: "rgba(6, 182, 212, 0.4)",
        gradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.05))"
      },
      "Scrap": {
        icon: "🗑️",
        color: "#ef4444",
        glow: "rgba(239, 68, 68, 0.4)",
        gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))"
      }
    };
    return configs[status] || configs["New"];
  };

  const statusConfig = getStatusConfig(request.status);

  return (
    <div
      className={"kanban-card" + (overdue ? " kanban-card-overdue" : "")}
      draggable
      onDragStart={(e) => onDragStart(e, request._id)}
      style={{
        background: statusConfig.gradient,
        borderLeft: `5px solid ${statusConfig.color}`,
      }}
    >
      {/* Status Icon Badge - Level 1 (Highest) */}
      <div 
        className="kanban-card-status-badge" 
        style={{
          background: statusConfig.color,
          boxShadow: `0 0 20px ${statusConfig.glow}, 0 4px 8px rgba(0,0,0,0.3)`
        }}
      >
        <span className="kanban-status-icon">{statusConfig.icon}</span>
      </div>

      {/* Main Content - Level 2 */}
      <div className="kanban-card-main-with-avatar">
        <div style={{ flex: 1 }}>
          {/* Primary Title - Largest, Boldest */}
          <div 
            className="kanban-card-title"
            style={{
              fontSize: '17px',
              fontWeight: 800,
              letterSpacing: '0.3px',
              opacity: 1,
              lineHeight: 1.3,
              marginBottom: '10px',
              color: 'var(--text-main)',
            }}
          >
            {request.subject}
          </div>
          
          {/* Secondary Info - Medium size, reduced opacity */}
          <div 
            className="kanban-card-sub"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              opacity: 0.75,
              color: 'var(--text-soft)',
              letterSpacing: '0.2px',
            }}
          >
            {request.equipment?.name || "No equipment"}
          </div>
        </div>
      </div>

      {/* Meta Section - Level 4 (Supporting) */}
      <div className="kanban-card-meta" style={{ marginTop: '16px' }}>
        <div className="kanban-card-meta-left">
          {/* Location - Tertiary info */}
          {request.equipment?.location && (
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              opacity: 0.65,
              color: 'var(--text-muted)',
              letterSpacing: '0.3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ fontSize: '13px', opacity: 0.8 }}>📍</span>
              {request.equipment.location}
            </span>
          )}
          
          {/* Date - Tertiary info */}
          {request.scheduledDate && (
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              opacity: 0.65,
              color: 'var(--text-muted)',
              letterSpacing: '0.3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '4px',
            }}>
              <span style={{ fontSize: '13px', opacity: 0.8 }}>📅</span>
              {new Date(request.scheduledDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Pills - Level 5 (Labels) */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span 
            className="kanban-pill" 
            style={{
              borderColor: statusConfig.color,
              color: statusConfig.color,
              fontSize: '10px',
              fontWeight: 800,
              opacity: 0.9,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              padding: '6px 12px',
            }}
          >
            {request.type}
          </span>
          
          {overdue && (
            <span 
              className="kanban-pill-danger"
              style={{
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                padding: '6px 12px',
                animation: 'overdueGlow 2s ease-in-out infinite',
              }}
            >
              ⚠️ OVERDUE
            </span>
          )}
        </div>
      </div>
    </div>
  );
};


