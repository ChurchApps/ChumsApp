import React from "react";
import { Routes, Route } from "react-router-dom";
import { ExportPage } from "./ExportPage"
import { ImportPage } from "./ImportPage"
import { SettingsPage } from "./SettingsPage"
import { ChurchPage } from "./ChurchPage"

export const Settings: React.FC = () => (
  <Routes>
    <Route path="/church" element={<ChurchPage />} />
    <Route path="/import" element={<ImportPage />} />
    <Route path="/export" element={<ExportPage />} />
    <Route path="/" element={<SettingsPage />} />
  </Routes>
)

