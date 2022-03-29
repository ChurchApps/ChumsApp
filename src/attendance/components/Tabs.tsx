import React from "react";
import { ReportWithFilter } from "../../appBase/components/reporting/ReportWithFilter";
import { UserHelper, Permissions } from "./";

export const Tabs: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState("");

  const getTab = (keyName: string, icon: string, text: string, dataCy?: string) => {
    let className = (keyName === selectedTab) ? "nav-link active" : "nav-link";
    return <li className="nav-item" key={keyName}><a href="about:blank" data-cy={dataCy} onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
  }

  let tabs = [];
  let defaultTab = "";
  let currentTab = null;
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push(getTab("attendance", "far fa-calendar-alt", "Attendance Trend", "trends-tab")); if (defaultTab === "") defaultTab = "attendance"; }
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push(getTab("groups", "fas fa-user", "Group Attendance", "group-tab")); if (defaultTab === "") defaultTab = "groups"; }
  if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

  switch (selectedTab) {
    case "attendance": currentTab = <ReportWithFilter keyName="attendanceTrend" autoRun={true} />; break;
    case "groups": currentTab = <ReportWithFilter keyName="groupAttendance" autoRun={true} />; break;
    default: currentTab = <div>Not implemented</div>; break;
  }

  return (<>
    <ul id="attendanceTabs" className="nav nav-tabs">{tabs}</ul>{currentTab}
  </>);
}
