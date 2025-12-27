import { useEffect, useState } from "react";
import api from "../api";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await api.get("/teams");
    setTeams(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    await api.post("/teams", { name });
    setName("");
    setCreating(false);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Maintenance teams</h1>
        <p className="page-subtitle">
          Define specialized teams and see which technicians belong to each.
        </p>
      </div>

      {/* Create team */}
      <div className="card" style={{ marginBottom: 18, maxWidth: 520 }}>
        <div className="card-header">
          <div>
            <div className="card-header-title">Add team</div>
            <div className="card-header-subtitle">
              Create a new maintenance team (Mechanics, Electricians, IT...).
            </div>
          </div>
        </div>
        <div className="card-body">
          <form
            onSubmit={handleCreate}
            style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
          >
            <div style={{ flex: 1 }}>
              <label className="form-label">Team name</label>
              <input
                className="input"
                placeholder="Mechanics, Electricians, IT Support..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating}
            >
              {creating ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
      </div>

      {/* Teams table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-header-title">Teams</div>
            <div className="card-header-subtitle">
              List of all maintenance teams and their members.
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
