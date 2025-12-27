import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get("/requests");
      setRequests(res.data);
      setLoading(false);
    };
    load();
  }, []);

  const events = requests
    .filter((r) => r.type === "Preventive" && r.scheduledDate)
    .map((r) => ({
      id: r._id,
      title: r.subject,
      date: r.scheduledDate,
    }));

  const handleDateClick = (info) => {
    navigate(`/requests/new?type=Preventive&date=${info.dateStr}`);
  };

  const handleEventClick = (info) => {
    navigate(`/requests/${info.event.id}`);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Preventive Calendar</h1>
        <p className="page-subtitle">
          All scheduled preventive maintenance jobs by date.
        </p>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-header">
          <div>
            <div className="card-header-title">Calendar</div>
            <div className="card-header-subtitle">
              Click a date to create a new preventive request.
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading && (
            <div style={{ fontSize: 12, color: "var(--text-soft)" }}>
              Loading calendar...
            </div>
          )}
          {!loading && (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="auto"
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
