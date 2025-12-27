import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  if (!user) return null;

  return (
    <div className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/equipment">Equipment</Link>
      <Link to="/requests">Maintenance</Link>
      <Link to="/create-request">New Request</Link>
      <button className="secondary" onClick={logout}>Logout</button>
    </div>
  );
}
