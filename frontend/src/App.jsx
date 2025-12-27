// App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  NavLink,
} from "react-router-dom";
import { useState } from 'react';
import { AuthProvider, useAuth } from "./context/AuthContext";  // Fixed path
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

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  Dashboard,
  ViewKanban,
  CalendarMonth,
  PrecisionManufacturing,
  Group,
  RequestQuote,
  AddCircleOutline,
  Menu as MenuIcon,
  Logout,
} from "@mui/icons-material";

const drawerWidth = 240;

const SidebarLink = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {({ isActive }) => (
        <ListItemButton
          sx={{
            borderRadius: 1.5,
            mb: 0.5,
            px: 2,
            py: 1,
            bgcolor: isActive ? "rgba(16,185,129,0.15)" : "transparent",
            color: isActive ? "primary.main" : "text.secondary",
            "&:hover": {
              bgcolor: isActive ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "inherit",
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText 
            primary={label}
            primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 500 }}
          />
        </ListItemButton>
      )}
    </NavLink>
  );
};

const Shell = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (!user) return children;

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 16,
            color: "#fff",
          }}
        >
          EM
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Equipment Manager
          </Typography>
          <Typography variant="caption" color="text.secondary">
            v2.0
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        <List dense disablePadding>
          <SidebarLink to="/" icon={<Dashboard />} label="Dashboard" />
          <SidebarLink to="/kanban" icon={<ViewKanban />} label="Kanban Board" />
          <SidebarLink to="/calendar" icon={<CalendarMonth />} label="Calendar" />
          <SidebarLink
            to="/equipment"
            icon={<PrecisionManufacturing />}
            label="Equipment"
          />
          <SidebarLink
            to="/requests"
            icon={<RequestQuote />}
            label="Requests"
          />
          <SidebarLink to="/teams" icon={<Group />} label="Teams" />
          <SidebarLink
            to="/requests/new"
            icon={<AddCircleOutline />}
            label="New Request"
          />
        </List>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.name || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={logout} sx={{ color: "text.secondary" }}>
          <Logout fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { 
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            color: "text.primary",
            width: "100%",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {location.pathname === "/" && "Dashboard"}
              {location.pathname === "/kanban" && "Kanban Board"}
              {location.pathname === "/calendar" && "Calendar"}
              {location.pathname === "/equipment" && "Equipment"}
              {location.pathname === "/requests" && "Requests"}
              {location.pathname === "/teams" && "Teams"}
              {location.pathname === "/requests/new" && "New Request"}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

const AppContent = () => {
  return (
    <Shell>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <KanbanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment"
          element={
            <ProtectedRoute>
              <EquipmentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment/new"
          element={
            <ProtectedRoute>
              <EquipmentFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <EquipmentRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/new"
          element={
            <ProtectedRoute>
              <RequestFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/:id"
          element={
            <ProtectedRoute>
              <RequestDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
