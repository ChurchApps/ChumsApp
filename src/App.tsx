import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ControlPanel } from "./ControlPanel";
import { UserProvider } from "./UserContext";
import { CookiesProvider } from "react-cookie";

const App: React.FC = () => (
  <UserProvider>
    <CookiesProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<ControlPanel />} />
        </Routes>
      </Router>
    </CookiesProvider>
  </UserProvider>
);
export default App;
