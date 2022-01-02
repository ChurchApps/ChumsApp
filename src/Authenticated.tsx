import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header, UserHelper } from "./components";
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
// import UserContext from "./UserContext";

export const Authenticated: React.FC = () => {
  //to force rerender on login
  // var user = React.useContext(UserContext)?.userName;
  // var church = React.useContext(UserContext)?.churchName;

  if (UserHelper.churchChanged) {
    UserHelper.churchChanged = false;
    return <Navigate to="/people" />
  }
  else return (
    <>
      <Header></Header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Navigate to={window.location.pathname} />} />
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
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
};
