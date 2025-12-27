import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const EquipmentFormPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    serialNumber: "",
    department: "",
    location: "",
    purchaseDate: "",
    warrantyExpiry: "",
    maintenanceTeam: "",
    assignedEmployee: "",
    defaultTechnician: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [teamRes, userRes] = await Promise.all([
        api.get("/teams"),
        api.get("/users"),
      ]);
      setTeams(teamRes.data);
      setUsers(userRes.data);
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await api.post("/equipment", form);
    setSaving(false);
    navigate("/equipment");
  };

  const technicians = users.filter((u) => u.role === "Technician");

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add equipment</h1>
        <p className="page-subtitle">
          Register an asset with ownership, location and default maintenance
          responsibility.
        </p>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="card-header">
          <div>
            <div className="card-header-title">Equipment details</div>
            <div className="card-header-subtitle">
              Name, serial, department and physical location.
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading && (
            <div style={{ fontSize: 12, color: "var(--text-soft)" }}>
              Loading teams and users...
            </div>
          )}
          {!loading && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Equipment name</label>
                <input
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="CNC Machine 01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Serial number</label>
                <input
                  className="input"
                  name="serialNumber"
                  value={form.serialNumber}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                  gap: 12,
                }}
              >
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    className="input"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Production, IT, Finance..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    className="input"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Plant A · Line 3"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                  gap: 12,
                }}
              >
                <div className="form-group">
                  <label className="form-label">Purchase date</label>
                  <input
                    type="date"
                    className="input"
                    name="purchaseDate"
                    value={form.purchaseDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Warranty expiry</label>
                  <input
                    type="date"
                    className="input"
                    name="warrantyExpiry"
                    value={form.warrantyExpiry}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Ownership */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                  gap: 12,
                }}
              >
                <div className="form-group">
                  <label className="form-label">Owning employee</label>
                  <select
                    className="select"
                    name="assignedEmployee"
                    value={form.assignedEmployee}
                    onChange={handleChange}
                  >
                    <option value="">Not linked</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Maintenance team</label>
                  <select
                    className="select"
                    name="maintenanceTeam"
                    value={form.maintenanceTeam}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select team</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Default technician */}
              <div className="form-group">
                <label className="form-label">
                  Default technician for this equipment
                </label>
                <select
                  className="select"
                  name="defaultTechnician"
                  value={form.defaultTechnician}
                  onChange={handleChange}
                >
                  <option value="">None</option>
                  {technicians.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <div
                  style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}
                >
                  This technician will be suggested when creating requests for
                  this equipment.
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save equipment"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentFormPage;
