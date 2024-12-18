import React from "react";
import { CampusEdit, ServiceEdit, ServiceTimeEdit, Tabs } from "./components";
import { Link } from "react-router-dom";
import { Grid, Icon, Table, TableBody, TableCell, TableRow, TableHead, IconButton, Menu, MenuItem, Paper, Box } from "@mui/material"
import { useMountedState, AttendanceInterface, CampusInterface, ServiceInterface, ServiceTimeInterface, GroupServiceTimeInterface, GroupInterface, ApiHelper, DisplayBox, ArrayHelper, Loading, Locale, UserHelper, ReportWithFilter } from "@churchapps/apphelper";
import { Banner } from "../baseComponents/Banner";
import { AttendanceSetup } from "./components/AttendanceSetup";
import { Permissions } from "@churchapps/apphelper";

export const AttendancePage = () => {
  const [selectedTab, setSelectedTab] = React.useState("");

  let defaultTab = "setup";

  const getTabs = () => {
    const tabs: {key: string, icon: string, label: string}[] = [];
    tabs.push({key:"setup", icon:"settings", label:Locale.label("attendance.tabs.setup")});
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push({key:"attendance", icon:"calendar_month", label:Locale.label("attendance.tabs.attTrend")}); if (defaultTab === "") defaultTab = "attendance"; }
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push({key:"groups", icon:"people", label:Locale.label("attendance.tabs.groupAtt")}); if (defaultTab === "") defaultTab = "groups"; }
    if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);
    return tabs;
  }

  const getCurrentTab = () => {
    let currentTab = null;
    switch (selectedTab) {
      case "setup": currentTab = <AttendanceSetup /> ; break;
      case "attendance": currentTab = <ReportWithFilter keyName="attendanceTrend" autoRun={true} />; break;
      case "groups": currentTab = <ReportWithFilter keyName="groupAttendance" autoRun={true} />; break;
    }
    return currentTab;
  }

  const getItem = (tab:any) => {
    if (tab.key === selectedTab) return (<li className="active"><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
    return (<li><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
  }


  return (
    <>
      <Banner><h1>{Locale.label("attendance.attendancePage.att")}</h1></Banner>
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

  )
}

