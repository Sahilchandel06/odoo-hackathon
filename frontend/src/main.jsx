// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f172a",  // Lighter slate-900
      paper: "#1e293b",     // Lighter slate-800
    },
    primary: { 
      main: "#10b981",      // Emerald-500 (less saturated green)
      light: "#34d399",
      dark: "#059669"
    },
    secondary: { 
      main: "#3b82f6",      // Blue-500
      light: "#60a5fa",
      dark: "#2563eb"
    },
    text: {
      primary: "#f1f5f9",   // Lighter text
      secondary: "#cbd5e1",  // Lighter secondary text
    },
    // divider: "#334155",     // Lighter divider
  },
  shape: { borderRadius: 8 },  // Less rounded (was 14)
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 2,  // Reduce shadow intensity
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
