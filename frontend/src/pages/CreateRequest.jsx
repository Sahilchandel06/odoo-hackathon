import { useEffect, useState } from "react";
import API from "../api";

export default function CreateRequest() {
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({ type: "Corrective" });

  useEffect(() => {
    API.get("/equipment").then((res) => setEquipment(res.data));
  }, []);

  const submit = async () => {
    await API.post("/requests", form);
    alert("Request Created");
  };

  return (
    <div className="container">
      <h2>Create Request</h2>

      <select onChange={(e) => setForm({ ...form, equipment: e.target.value })}>
        <option>Select Equipment</option>
        {equipment.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Problem"
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />

      <select onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option value="Corrective">Corrective</option>
        <option value="Preventive">Preventive</option>
      </select>

      <input
        type="date"
        onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}
