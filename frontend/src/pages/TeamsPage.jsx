import { useEffect, useState } from "react";
import api from "../api";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const load = async () => {
    setLoading(true);
    const [teamsRes, usersRes] = await Promise.all([
      api.get("/teams"),
      api.get("/users"),
    ]);
    setTeams(teamsRes.data);
    setUsers(usersRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    await api.post("/teams", { name, members: selectedMembers });
    setName("");
    setSelectedMembers([]);
    setCreating(false);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Maintenance teams</h1>
        <p className="page-subtitle">
          Define specialized teams and link technicians to each team.
        </p>
      </div>

      {/* Create team */}
      <div className="card" style={{ marginBottom: 18, maxWidth: 520 }}>
        <div className="card-header">
          <div>
            <div className="card-header-title">Add team</div>
            <div className="card-header-subtitle">
              Set a team name and choose its members.
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Team name</label>
              <input
                className="input"
                placeholder="Mechanics, Electricians, IT Support..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Team members</label>
              <div
                style={{
                  maxHeight: 180,
                  overflowY: "auto",
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  backgroundColor: "#020617",
                  fontSize: 12,
                }}
              >
                {users.map((u) => (
                  <label
                    key={u._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(u._id)}
                      onChange={() => handleToggleMember(u._id)}
                    />
                    <span>
                      {u.name}{" "}
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 11,
                        }}
                      >
                        ({u.role})
                      </span>
                    </span>
                  </label>
                ))}
                {!users.length && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    No users yet. Create accounts first.
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 8,
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={creating}
              >
                {creating ? "Adding..." : "Add team"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Teams table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-header-title">Teams</div>
            <div className="card-header-subtitle">
              All maintenance teams and their member technicians.
            </div>
          </div>
        </div>
        <div className="card-body table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={2} style={{ padding: 20 }}>
                    Loading teams...
                  </td>
                </tr>
              )}
              {!loading && teams.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ padding: 20 }}>
                    No teams yet. Create your first maintenance team above.
                  </td>
                </tr>
              )}
              {!loading &&
                teams.map((t) => (
                  <tr key={t._id}>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</td>
                    <td style={{ fontSize: 12, color: "var(--text-soft)" }}>
                      {t.members && t.members.length
                        ? t.members.map((m) => m.name).join(", ")
                        : "No members assigned"}
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

export default TeamsPage;
