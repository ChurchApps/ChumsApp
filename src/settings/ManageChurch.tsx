import React, { useState } from "react";
import { ChurchSettings, Roles, RoleEdit } from "./components"
import { ChurchInterface, ApiHelper, UserHelper, Permissions, DisplayBox, Locale } from "@churchapps/apphelper"
import { Navigate } from "react-router-dom";
import { Grid, Icon } from "@mui/material";
import { Banner } from "../baseComponents/Banner";
import { ChurchSettingsTab } from "./components/ChurchSettingsTab";
import { RolesTab } from "./components/RolesTab";

export const ManageChurch = () => {
  const [selectedTab, setSelectedTab] = React.useState("plans");
  const [church, setChurch] = useState<ChurchInterface>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>("");


  const jwt = ApiHelper.getConfig("MembershipApi").jwt;
  const churchId = UserHelper.currentUserChurch.church.id;


  const getCurrentTab = () => {

    let currentTab = <div></div>;
    if (church) {
      switch (selectedTab) {
        case "settings": currentTab = <ChurchSettingsTab />; break;
        case "roles": currentTab = <RolesTab church={church} />; break;
      }
    }
    return currentTab;
  }


  const getItem = (tab:any) => {
    if (tab.key === selectedTab) return (<li className="active"><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
    return (<li><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
  }

  const getTabs = () => {
    let tabs = [];
    tabs.push({ key: "settings", icon: "settings", label: Locale.label("settings.manageChurch.manage")});
    tabs.push({ key: "roles", icon: "lock", label: Locale.label("settings.roles.roles")});

    if (selectedTab === "") setSelectedTab("settings");
    return tabs;
  }

  const loadData = () => {
    //const churchId = params.id;
    if (!UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) setRedirectUrl("/");
    ApiHelper.get("/churches/" + churchId + "?include=permissions", "MembershipApi").then(data => setChurch(data));
  }

  React.useEffect(loadData, [UserHelper.currentUserChurch.church.id]); //eslint-disable-line

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else return (
    <>
      <Banner><h1>{Locale.label("settings.manageChurch.manage")}: {church?.name}</h1></Banner>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <div className="sideNav" style={{height:"100vh", borderRight:"1px solid #CCC" }}>
            <ul>
              {getTabs().map((tab, index) => getItem(tab))}
              <li><a href={`https://transfer.chums.org/login?jwt=${jwt}&churchId=${churchId}`} target="_blank" rel="noreferrer noopener"><Icon>play_arrow</Icon> {Locale.label("settings.manageChurch.imEx")}</a></li>
            </ul>
          </div>
        </Grid>
        <Grid item xs={12} md={10}>
          <div id="mainContent">
            {getCurrentTab()}
          </div>
        </Grid>
      </Grid>
    </>
  );
}

