import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
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
import { ProfilePage } from "./profile/ProfilePage";
import { FormPage } from "./forms/FormPage";
// import UserContext from "./UserContext";

interface Props {
  location: any;
}

export const Authenticated: React.FC<Props> = (props) => {
  //to force rerender on login
  // var user = React.useContext(UserContext)?.userName;
  // var church = React.useContext(UserContext)?.churchName;

  if (UserHelper.churchChanged) {
    UserHelper.churchChanged = false;
    return <Redirect to="/people" />
  }
  else return (
    <>
      <link rel="stylesheet" href="/css/cp.css" />
      <Header></Header>
      <div className="container">
        <Switch>
          <Route path="/login"><Redirect to={props.location} /></Route>
          <Route path="/people/:id" component={PersonPage}></Route>
          <Route path="/people"><PeoplePage /></Route>
          <Route path="/groups/:id" component={GroupPage}></Route>
          <Route path="/groups"><GroupsPage /></Route>
          <Route path="/attendance"><AttendancePage /></Route>
          <Route path="/donations/funds/:id" component={FundPage}></Route>
          <Route path="/donations/:id" component={DonationBatchPage}></Route>
          <Route path="/donations"><DonationsPage /></Route>
          <Route path="/forms/:id" component={FormPage}></Route>
          <Route path="/forms"><FormsPage /></Route>
          <Route path="/settings"><Settings /></Route>
          <Route path="/profile"><ProfilePage /></Route>
        </Switch>
      </div>
      <script src="/js/cp.js"></script>
    </>
  );
};
