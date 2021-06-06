import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ControlPanel } from "./ControlPanel";
import { UserProvider } from "./UserContext";
import { CookiesProvider } from "react-cookie";

const App: React.FC = () => (
  <UserProvider>
    <CookiesProvider>
      <Router>
        <Switch>
          <Route path="/"><ControlPanel /></Route>
        </Switch>
      </Router>
    </CookiesProvider>
  </UserProvider>
)
export default App;

