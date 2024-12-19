import React from "react";
import { ApiHelper, UserHelper, Locale, Permissions } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";
import { Grid, Icon } from "@mui/material";
import { Banner } from "../baseComponents/Banner";
import { UsageTrendsTab } from "./components/UsageTrendTab";
import { ChurchesTab } from "./components/ChurchesTab";

export const AdminPage = () => {
  const [selectedTab, setSelectedTab] = React.useState("churches");

  const getCurrentTab = () => {
    let currentTab = <div></div>;
    switch (selectedTab) {
      case "churches": currentTab = <ChurchesTab />; break;
      case "usage": currentTab = <UsageTrendsTab />; break;
    }
    return currentTab;
  }


  const getItem = (tab:any) => {
    if (tab.key === selectedTab) return (<li className="active"><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
    return (<li><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
  }

  const getTabs = () => {
    let tabs = [];
    tabs.push({ key: "churches", icon: "church", label: Locale.label("serverAdmin.adminPage.churches")});
    tabs.push({ key: "usage", icon: "show_chart", label: Locale.label("serverAdmin.adminPage.usageTrends")});

    return tabs;
  }

  return (
    <>
      <Banner><h1>{Locale.label("serverAdmin.adminPage.servAdmin")}</h1></Banner>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <div className="sideNav" style={{height:"100vh", borderRight:"1px solid #CCC" }}>
            <ul>{getTabs().map((tab, index) => getItem(tab))}</ul>
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
