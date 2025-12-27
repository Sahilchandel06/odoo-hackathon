import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const RequestFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    type: "Corrective",
    equipment: "",
    scheduledDate: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get("/equipment");
      setEquipment(res.data);

      const qsType = search.get("type");
      const qsDate = search.get("date");
      setForm((prev) => ({
        ...prev,
        type: qsType || prev.type,
        scheduledDate: qsDate || prev.scheduledDate,
      }));

      setLoading(false);
    };
    load();
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await api.post("/requests", form);
    setSaving(false);
    navigate("/kanban");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">New maintenance request</h1>
        <p className="page-subtitle">
          Log a corrective breakdown or schedule a preventive checkup.
        </p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card-header">
          <div>
            <div className="card-header-title">Request details</div>
            <div className="card-header-subtitle">
              Request type, subject, equipment and schedule.
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading && (
            <div style={{ fontSize: 12, color: "var(--text-soft)" }}>
              Loading equipment...
            </div>
          )}
          {!loading && (
            <form onSubmit={handleSubmit}>
              {/* Subject */}
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  className="input"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder='What is wrong? e.g. "Leaking oil"'
                  required
                />
              </div>

              {/* Type + equipment */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                  gap: 12,
                }}
              >
                <div className="form-group">
                  <label className="form-label">Request type</label>
                  <select
                    className="select"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="Corrective">Corrective (Breakdown)</option>
                    <option value="Preventive">Preventive (Routine)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Equipment</label>
                  <select
                    className="select"
                    name="equipment"
                    value={form.equipment}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select equipment</option>
                    {equipment.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Scheduled date */}
              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">
                  Scheduled date
                  <span style={{ color: "var(--text-muted)" }}>
                    {" "}
                    (for preventive jobs)
                  </span>
                </label>
                <input
                  type="date"
                  className="input"
                  name="scheduledDate"
                  value={form.scheduledDate}
                  onChange={handleChange}
                />
              </div>

              {/* Actions */}
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
                  {saving ? "Creating..." : "Create request"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestFormPage;
