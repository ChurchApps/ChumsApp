import React from "react";
import { Routes, Route } from "react-router-dom";
import { SettingsPage } from "./SettingsPage"
import { ChurchPage } from "./ChurchPage"

export const Settings: React.FC = () => (
  <Routes>
    <Route path="/church" element={<ChurchPage />} />
    <Route path="/" element={<SettingsPage />} />
  </Routes>
)

