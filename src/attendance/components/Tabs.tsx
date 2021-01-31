import React from "react";
import { UserHelper, Permissions } from "./";
import { AttendanceTrend } from "./AttendanceTrend";
import { GroupAttendance } from "./GroupAttendance";


//interface Props { filter: AttendanceFilterInterface }

//unused

export const Tabs: React.FC = () => {
    const [selectedTab, setSelectedTab] = React.useState("");

    const getTab = (keyName: string, icon: string, text: string, dataCy?: string) => {
        var className = (keyName === selectedTab) ? "nav-link active" : "nav-link";
        return <li className="nav-item" key={keyName}><a href="about:blank" data-cy={dataCy} onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
    }

    var tabs = [];
    var defaultTab = "";
    var currentTab = null;
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push(getTab("attendance", "far fa-calendar-alt", "Attendance Trend", "trends-tab")); if (defaultTab === "") defaultTab = "attendance"; }
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push(getTab("groups", "fas fa-user", "Group Attendance", "group-tab")); if (defaultTab === "") defaultTab = "groups"; }
    //if (UserHelper.checkAccess("Attendance", "View")) { tabs.push(getTab("individuals", "fas fa-user", "People")); if (defaultTab === "") defaultTab = "individuals"; }
    if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

    switch (selectedTab) {
        case "attendance": currentTab = <AttendanceTrend />; break;
        case "groups": currentTab = <GroupAttendance />; break;
        //case "individuals": currentTab = <Individuals filter={props.filter} />; break;
        default: currentTab = <div>Not implemented</div>; break;
    }

    return (<>
        <ul id="attendanceTabs" className="nav nav-tabs">{tabs}</ul>{currentTab}
    </>);
}