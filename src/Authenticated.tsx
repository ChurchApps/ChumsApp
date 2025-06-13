import React from "react";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import { Wrapper, ErrorBoundary } from "./components";
import { UserHelper } from "@churchapps/apphelper";
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
import { ReportPage as AdminReportPage } from "./serverAdmin/ReportPage";
import { Box } from "@mui/material";
import { TasksPage } from "./tasks/TasksPage";
import { TaskPage } from "./tasks/TaskPage";
import { AutomationsPage } from "./tasks/automations/AutomationsPage";
import UserContext from "./UserContext";
import { DashboardPage } from "./dashboard/DashboardPage";
import { AdminPage } from "./serverAdmin/AdminPage";
import { ProfilePage } from "./profile/ProfilePage";
import { PlansPage } from "./plans/PlansPage";
import { PlanPage } from "./plans/PlanPage";
import { MinistryPage } from "./plans/MinistryPage";
import { DonationBatchesPage } from "./donations/DonationBatchesPage";
import { FundsPage } from "./donations/FundsPage";
import { SongsPage } from "./plans/songs/SongsPage";
import { SongPage } from "./plans/songs/SongPage";
import { PrintPlan } from "./plans/PrintPlan";
import { DevicesPage } from "./profile/DevicesPage";
import { PrintDonationPage } from "./donations/PrintDonationPage";
import { OAuthPage } from "./OAuth";

export const Authenticated: React.FC = () => {
  const navigate = useNavigate()

  let context = React.useContext(UserContext);

  UserHelper.currentUserChurch = context.userChurch;
  UserHelper.userChurches = context.userChurches;
  UserHelper.user = context.user;
  UserHelper.person = context.person;

  const LayoutWithWrapper: React.FC = () => (<Box sx={{ display: "flex" }}>
    <Wrapper>
      <ErrorBoundary>
        {/* This renders the nested child route */}
        <Outlet />
      </ErrorBoundary>
    </Wrapper>
  </Box>)

  if (UserHelper.churchChanged) {
    UserHelper.churchChanged = false;
    navigate("/")
  }
  else return (
    <Routes>
      <Route element={<LayoutWithWrapper />}>
        <Route path="/admin/report/:keyName" element={<AdminReportPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/people/:id" element={<PersonPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/groups/:id" element={<GroupPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/donations/funds/:id" element={<FundPage />} />
        <Route path="/donations/funds" element={<FundsPage />} />
        <Route path="/donations/batches/:id" element={<DonationBatchPage />} />
        <Route path="/donations/batches" element={<DonationBatchesPage />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/forms/:id" element={<FormPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/reports/:keyName" element={<ReportPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/tasks/automations" element={<AutomationsPage />} />
        <Route path="/tasks/:id" element={<TaskPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/profile/devices" element={<DevicesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/plans/ministries/:id" element={<MinistryPage />} />
        <Route path="/plans/:id" element={<PlanPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/plans/songs" element={<SongsPage />} />
        <Route path="/plans/songs/:id" element={<SongPage />} />
        <Route path="/" element={<DashboardPage />} />
      </Route>

      <Route path="/oauth" element={<OAuthPage />} />
      <Route path="/donations/print/:personId" element={<PrintDonationPage />} />
      <Route path="/plans/print/:id" element={<PrintPlan />} />
    </Routes>

  );
};
