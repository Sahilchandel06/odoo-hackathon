import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const EquipmentListPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get("/equipment");
      setEquipment(res.data);
      setLoading(false);
    };
    load();
  }, []);

  const departments = Array.from(
    new Set(equipment.map((e) => e.department).filter(Boolean))
  );

  const filteredEquipment = equipment.filter((e) =>
    departmentFilter ? e.department === departmentFilter : true
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Equipment</h1>
        <p className="page-subtitle">
          Central registry of company assets with their maintenance status.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          gap: 8,
        }}
      >
        <button
          className="btn btn-primary"
          onClick={() => navigate("/equipment/new")}
        >
          + Add equipment
        </button>

        <select
          className="select"
          style={{ maxWidth: 220 }}
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-header-title">Equipment list</div>
            <div className="card-header-subtitle">
              Track by department, employee and maintenance team.
            </div>
          </div>
        </div>
        <div className="card-body table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Department</th>
                <th>Location</th>
                <th>Employee</th>
                <th>Team</th>
                <th>Status</th>
                <th>Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ padding: 20 }}>
                    Loading equipment...
                  </td>
                </tr>
              )}
              {!loading && filteredEquipment.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 20 }}>
                    No equipment yet. Add your first asset.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredEquipment.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {e.name}
                      </div>
                      {e.serialNumber && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                          }}
                        >
                          SN: {e.serialNumber}
                        </div>
                      )}
                    </td>
                    <td>{e.department || "-"}</td>
                    <td>{e.location || "-"}</td>
                    <td>{e.assignedEmployee?.name || "-"}</td>
                    <td>{e.maintenanceTeam?.name || "-"}</td>
                    <td>
                      {e.isScrapped ? (
                        <span className="badge badge-status-scrap">
                          Scrapped
                        </span>
                      ) : (
                        <span className="badge badge-status-repaired">
                          Active
                        </span>
                      )}
                    </td>
                    <td>
                      {/* Smart button: goes to list for this equipment */}
                      <button
                        className="btn btn-outline"
                        onClick={() =>
                          navigate(`/equipment/${e._id}/requests`)
                        }
                      >
                        Maintenance
                      </button>
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

export default EquipmentListPage;
