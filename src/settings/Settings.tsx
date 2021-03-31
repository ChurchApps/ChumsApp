import React from "react";
import { Switch, Route } from "react-router-dom";
import { ExportPage } from "./ExportPage"
import { ImportPage } from "./ImportPage"
import { SettingsPage } from "./SettingsPage"
import { ChurchPage } from "./ChurchPage"

export const Settings: React.FC = () => {
    return (
        <Switch>
            <Route path="/settings/church"><ChurchPage /></Route>
            <Route path="/settings/import"><ImportPage /></Route>
            <Route path="/settings/export"><ExportPage /></Route>
            <Route path="/settings"><SettingsPage /></Route>
        </Switch>
    );
}


