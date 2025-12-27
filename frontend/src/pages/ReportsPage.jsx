import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import api from "../api";

const ReportsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get("/requests");
      setRequests(res.data);
      setLoading(false);
    };
    load();
  }, []);

  const teamCounts = {};
  const equipmentCounts = {};

  requests.forEach((r) => {
    const teamName = r.maintenanceTeam?.name || "No team";
    teamCounts[teamName] = (teamCounts[teamName] || 0) + 1;

    const eqName = r.equipment?.name || "No equipment";
    equipmentCounts[eqName] = (equipmentCounts[eqName] || 0) + 1;
  });

  const teamData = [["Team", "Requests"], ...Object.entries(teamCounts)];
  const equipmentData = [
    ["Equipment", "Requests"],
    ...Object.entries(equipmentCounts),
  ];

  const axis = { textStyle: { color: "#e5e7eb", fontSize: 11 } };

  const teamOptions = {
    // title: "Requests per Maintenance Team",
    backgroundColor: "transparent",
    legend: { position: "none" },
    chartArea: { width: "70%", height: "65%" },
    hAxis: axis,
    vAxis: axis,
    colors: ["#22c55e"],
  };

  const equipmentOptions = {
    // title: "Requests per Equipment",
    backgroundColor: "transparent",
    legend: { position: "none" },
    chartArea: { width: "70%", height: "65%" },
    hAxis: axis,
    vAxis: axis,
    colors: ["#38bdf8"],
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">
          Number of maintenance requests per team and per equipment.
        </p>
      </div>

      {loading && (
        <div style={{ fontSize: 12, color: "var(--text-soft)" }}>
          Loading report data...
        </div>
      )}

      {!loading && (
        <>
          <div className="card" style={{ marginBottom: 18 }}>
            <div className="card-header">
              <div>
                <div className="card-header-title" style={{ color: "white" }}>
                  Requests per Maintenance Team
                </div>

                <div className="card-header-subtitle">
                  How work is distributed across teams.
                </div>
              </div>
            </div>
            <div className="card-body">
              {teamData.length > 1 ? (
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="320px"
                  data={teamData}
                  options={teamOptions}
                />
              ) : (
                <div style={{ fontSize: 12, color: "var(--text-soft)" }}>
                  No data yet. Create some requests first.
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-header-title">Requests per Equipment</div>
                <div className="card-header-subtitle">
                  Which assets generate the most maintenance.
                </div>
              </div>
            </div>
            <div className="card-body">
              {equipmentData.length > 1 ? (
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="320px"
                  data={equipmentData}
                  options={equipmentOptions}
                />
              ) : (
                <div style={{ fontSize: 12, color: "var(--text-soft)" }}>
                  No data yet. Create some requests first.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
