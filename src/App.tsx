import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ControlPanel } from "./ControlPanel";
import { UserProvider } from "./UserContext";
import { CookiesProvider } from "react-cookie";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "./appBase/components/markdownEditor/editor.css";

const mdTheme = createTheme({
  palette: {
    secondary: {
      main: "#444444"
    }
  },
  components: {
    MuiTextField: { defaultProps: { margin: "normal" } },
    MuiFormControl: { defaultProps: { margin: "normal" } }
  }
});

const App: React.FC = () => (
  <UserProvider>
    <CookiesProvider>
      <ThemeProvider theme={mdTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/*" element={<ControlPanel />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </CookiesProvider>
  </UserProvider>
);
export default App;
