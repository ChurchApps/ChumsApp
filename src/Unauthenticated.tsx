import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Login"
import { UI } from "./ui/Test";

export const Unauthenticated = () => (
  <>
    <Routes>
      <Route path="/ui" element={<UI />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  </>
)
