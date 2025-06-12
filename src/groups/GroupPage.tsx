import React from "react";
import { MembersAdd, GroupDetails, Tabs, SessionAdd, GroupMembers, GroupSessions } from "./components";
import { ApiHelper, DisplayBox, GroupInterface, PersonInterface, SessionInterface, PersonHelper, Locale, UserHelper, Permissions } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { Grid, Icon } from "@mui/material"
import { Banner } from "@churchapps/apphelper";
import { GroupMembersTab } from "./components/GroupMembersTab";
import { GroupSessionsTab } from "./components/GroupSessionsTab";

export const GroupPage = () => {
  const params = useParams();

  const [group, setGroup] = React.useState({} as GroupInterface);
  const [selectedTab, setSelectedTab] = React.useState("");

  const loadData = () => { ApiHelper.get("/groups/" + params.id, "MembershipApi").then(data => setGroup(data)); }
  React.useEffect(loadData, []); //eslint-disable-line

  const handleGroupUpdated = (g: GroupInterface) => {
    setGroup(g);
    loadData();
  }



  let defaultTab = "settings";

  const getTabs = () => {
    const tabs: { key: string, icon: string, label: string }[] = [];
    tabs.push({ key: "settings", icon: "settings", label: Locale.label("components.wrapper.set") });
    if (UserHelper.checkAccess(Permissions.membershipApi.groupMembers.view)) tabs.push({ key: "members", icon: "people", label: Locale.label("groups.tabs.mem") });
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view) && group?.trackAttendance) tabs.push({ key: "sessions", icon: "calendar_month", label: Locale.label("groups.tabs.ses") });

    return tabs;
  }

  React.useEffect(() => {
    if (selectedTab === "" && defaultTab !== "") {
      setSelectedTab(defaultTab);
    }
  }, [selectedTab, defaultTab]);

  const getCurrentTab = () => {
    let currentTab = null;
    switch (selectedTab) {
      case "settings": currentTab = <GroupDetails key="settings" group={group} updatedFunction={handleGroupUpdated} />; break;
      case "members": currentTab = <GroupMembersTab key="members" group={group} />; break;
      case "sessions": currentTab = <GroupSessionsTab key="sessions" group={group} />; break;
    }
    return currentTab;
  }

  const getItem = (tab: any) => {
    if (tab.key === selectedTab) return (
      <li key={tab.key} className="active">
        <a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}>
          <Icon>{tab.icon}</Icon> {tab.label}
        </a>
      </li>
    );
    return (
      <li key={tab.key}>
        <a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}>
          <Icon>{tab.icon}</Icon> {tab.label}
        </a>
      </li>
    );
  }

  return (
    <>
      <Banner><h1>{group?.name}</h1></Banner>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <div className="sideNav" style={{ height: "100vh", borderRight: "1px solid #CCC" }}>
            <ul>{getTabs().map((tab) => getItem(tab))}</ul>
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
