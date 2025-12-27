import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import KanbanPage from "./pages/KanbanPage";
import CalendarPage from "./pages/CalendarPage";
import EquipmentListPage from "./pages/EquipmentListPage";
import EquipmentFormPage from "./pages/EquipmentFormPage";
import EquipmentRequestsPage from "./pages/EquipmentRequestsPage";
import TeamsPage from "./pages/TeamsPage";
import RequestFormPage from "./pages/RequestFormPage";
import RequestDetailPage from "./pages/RequestDetailPage";
import ReportsPage from "./pages/ReportsPage";

const SidebarLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "app-nav-link " + (isActive ? "app-nav-link-active" : "")
    }
  >
    <span className="app-nav-link-dot" />
    {children}
  </NavLink>
);

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar-header">
          <div className="app-logo">GG</div>
          <div>
            <div className="app-brand-title">GearGuard</div>
            <div className="app-brand-subtitle">Maintenance Tracker</div>
          </div>
        </div>
        <nav className="app-nav">
          <SidebarLink to="/">Dashboard</SidebarLink>
          <SidebarLink to="/kanban">Kanban Board</SidebarLink>
          <SidebarLink to="/calendar">Calendar</SidebarLink>
          <SidebarLink to="/equipment">Equipment</SidebarLink>
          <SidebarLink to="/teams">Teams</SidebarLink>
          <SidebarLink to="/requests/new">Create Request</SidebarLink>
          <SidebarLink to="/reports">Reports</SidebarLink>
        </nav>
        <div className="app-sidebar-footer">
          <span>{user?.name}</span>
          <button className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="app-main-header-mobile">
          <span>GearGuard</span>
          {user && (
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          )}
        </header>
        <div className="app-main-content">{children}</div>
      </main>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/kanban"
      element={
        <ProtectedRoute>
          <Layout>
            <KanbanPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/calendar"
      element={
        <ProtectedRoute>
          <Layout>
            <CalendarPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/equipment"
      element={
        <ProtectedRoute>
          <Layout>
            <EquipmentListPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/equipment/new"
      element={
        <ProtectedRoute>
          <Layout>
            <EquipmentFormPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/equipment/:id/requests"
      element={
        <ProtectedRoute>
          <Layout>
            <EquipmentRequestsPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teams"
      element={
        <ProtectedRoute>
          <Layout>
            <TeamsPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/requests/new"
      element={
        <ProtectedRoute>
          <Layout>
            <RequestFormPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/requests/:id"
      element={
        <ProtectedRoute>
          <Layout>
            <RequestDetailPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <Layout>
            <ReportsPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
