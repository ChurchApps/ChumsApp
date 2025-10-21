import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PagesPage } from "./PagesPage";
import { BlocksPage } from "./BlocksPage";
import { AppearancePage } from "./AppearancePage";
import { FilesPage } from "./FilesPage";

export const Site: React.FC = () => (
  <Routes>
    <Route path="/pages" element={<PagesPage />} />
    <Route path="/blocks" element={<BlocksPage />} />
    <Route path="/appearance" element={<AppearancePage />} />
    <Route path="/files" element={<FilesPage />} />
    <Route path="/" element={<Navigate to="/pages" replace />} />
  </Routes>
);
