import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ControlPanel } from "./ControlPanel";
import { UserProvider } from "./UserContext";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Switch>
          <Route path="/"><ControlPanel /></Route>
        </Switch>
      </Router>
    </UserProvider>
  );
}
export default App;

