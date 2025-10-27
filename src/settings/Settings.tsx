import React from "react";
import { Routes, Route } from "react-router-dom";
import { ManageChurch } from "./ManageChurch";
import { RolePage } from "./RolePage";
import { MobileAppSettingsPage } from "./MobileAppSettingsPage";

export const Settings: React.FC = () => (
  <Routes>
    <Route path="/mobile" element={<MobileAppSettingsPage />} />
    <Route path="/role/:roleId" element={<RolePage />} />
    <Route path="/" element={<ManageChurch />} />
  </Routes>
);
