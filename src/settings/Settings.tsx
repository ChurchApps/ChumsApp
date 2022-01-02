import React from "react";
import { Routes, Route } from "react-router-dom";
import { ExportPage } from "./ExportPage"
import { ImportPage } from "./ImportPage"
import { SettingsPage } from "./SettingsPage"
import { ChurchPage } from "./ChurchPage"

export const Settings: React.FC = () => (
  <Routes>
    <Route path="/settings/church" element={<ChurchPage />} />
    <Route path="/settings/import" element={<ImportPage />} />
    <Route path="/settings/export" element={<ExportPage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </Routes>
)

