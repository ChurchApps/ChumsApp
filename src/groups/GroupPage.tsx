import React from "react";
import { GroupDetails, GroupBanner } from "./components";
import { ApiHelper, type GroupInterface, Locale, UserHelper, Permissions } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { Grid, Icon } from "@mui/material"
import { GroupMembersTab } from "./components/GroupMembersTab";
import { GroupSessionsTab } from "./components/GroupSessionsTab";
import { Wrapper } from "../components";

export const GroupPage = () => {
  const params = useParams();

  const [group, setGroup] = React.useState({} as GroupInterface);
  const [selectedTab, setSelectedTab] = React.useState("");
  const [inPhotoEditMode, setInPhotoEditMode] = React.useState(false);
  const [editMode, setEditMode] = React.useState("display");

  const loadData = () => { ApiHelper.get("/groups/" + params.id, "MembershipApi").then(data => setGroup(data)); }
  React.useEffect(loadData, [params.id]);

  const handleGroupUpdated = (g: GroupInterface) => {
    setGroup(g);
    loadData();
  }



  const defaultTab = "settings";

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
      case "settings": currentTab = <GroupDetails 
        key="settings" 
        group={group} 
        updatedFunction={handleGroupUpdated}
        loadData={loadData}
        inPhotoEditMode={inPhotoEditMode}
        setInPhotoEditMode={setInPhotoEditMode}
        editMode={editMode}
        setEditMode={setEditMode}
      />; break;
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
      <GroupBanner 
        group={group} 
        onTabChange={setSelectedTab}
        togglePhotoEditor={setInPhotoEditMode}
        onEdit={() => setEditMode("edit")}
      />
      <Wrapper>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2 }}>
            <div className="sideNav" style={{ height: "100vh", borderRight: "1px solid #CCC" }}>
              <ul>{getTabs().map((tab) => getItem(tab))}</ul>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 10 }}>
            <div id="mainContent">
              {getCurrentTab()}
            </div>
          </Grid>
        </Grid>
      </Wrapper>
    </>
  );
}
