import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const EquipmentListPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Equipment</h1>
        <p className="page-subtitle">
          Central registry of all machines, vehicles and IT assets.
        </p>
      </div>

      <div style={{ marginBottom: 14 }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/equipment/new")}
        >
          + Add equipment
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-header-title">Equipment list</div>
            <div className="card-header-subtitle">
              Track ownership, location and maintenance status.
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
                <th>Team</th>
                <th>Status</th>
                <th>Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} style={{ padding: 20 }}>
                    Loading equipment...
                  </td>
                </tr>
              )}
              {!loading && equipment.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 20 }}>
                    No equipment yet. Add your first machine or asset.
                  </td>
                </tr>
              )}
              {!loading &&
                equipment.map((e) => (
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
