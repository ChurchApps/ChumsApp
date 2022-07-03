import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { UserHelper, Wrapper } from "./components";
import { PeoplePage } from "./people/PeoplePage";
import { PersonPage } from "./people/PersonPage";
import { GroupsPage } from "./groups/GroupsPage";
import { GroupPage } from "./groups/GroupPage";
import { AttendancePage } from "./attendance/AttendancePage";
import { DonationsPage } from "./donations/DonationsPage";
import { DonationBatchPage } from "./donations/DonationBatchPage";
import { FundPage } from "./donations/FundPage";
import { FormsPage } from "./forms/FormsPage";
import { Settings } from "./settings/Settings";
import { FormPage } from "./forms/FormPage";
import { ReportsPage } from "./reports/ReportsPage";
import { ReportPage } from "./reports/ReportPage";
import { Box } from "@mui/material";
import { TasksPage } from "./tasks/TasksPage";
// import UserContext from "./UserContext";

export const Authenticated: React.FC = () => {
  const navigate = useNavigate()

  if (UserHelper.churchChanged) {
    UserHelper.churchChanged = false;
    navigate("/people")
  }
  else return (
    <Box sx={{ display: "flex", backgroundColor: "#EEE" }}>
      <Wrapper>
        <Routes>
          <Route path="/people/:id" element={<PersonPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/groups/:id" element={<GroupPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/donations/funds/:id" element={<FundPage />} />
          <Route path="/donations/:id" element={<DonationBatchPage />} />
          <Route path="/donations" element={<DonationsPage />} />
          <Route path="/forms/:id" element={<FormPage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/reports/:keyName" element={<ReportPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings/*" element={<Settings />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </Wrapper>
    </Box>

  );
};
