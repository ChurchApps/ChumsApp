import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Login"
import { UI } from "./ui/Test";
import { Pingback } from "./Pingback";

export const Unauthenticated = () => (
  <>
    <Routes>
      <Route path="/pingback" element={<Pingback />} />
      <Route path="/ui" element={<UI />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  </>
)
