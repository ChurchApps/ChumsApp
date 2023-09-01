import React, { useCallback } from "react";
import { GroupMembers, GroupSessions } from ".";
import { UserHelper, GroupInterface, SessionInterface, PersonInterface, Permissions } from "@churchapps/apphelper";
import { Box, Paper, Tabs as MaterialTabs, Tab } from "@mui/material";

interface Props {
  group: GroupInterface
  addedPerson?: PersonInterface,
  addedSession?: SessionInterface,
  addedCallback: () => void,
  sidebarVisibilityFunction: (name: string, visible: boolean) => void
}

export const Tabs: React.FC<Props> = (props) => {
  const [selectedTab, setSelectedTab] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);

  const getTab = (index: number, keyName: string, icon: string, text: string) => (
    <Tab key={index} style={{ textTransform: "none", color: "#000" }} onClick={() => { setSelectedTab(keyName); setTabIndex(index); }} label={<>{text}</>} />
  )

  const setVisibilityState = useCallback(() => {
    if (selectedTab === "members" && UserHelper.checkAccess(Permissions.membershipApi.groupMembers.edit)) props.sidebarVisibilityFunction("addPerson", true);
    if (selectedTab === "sessions" && UserHelper.checkAccess(Permissions.attendanceApi.attendance.edit)) {
      props.sidebarVisibilityFunction("addPerson", true);
      props.sidebarVisibilityFunction("addMember", true);
    }
  }, [props, selectedTab]
  )
  const getCurrentTab = () => {

    let currentTab = null;
    switch (selectedTab) {
      case "members": currentTab = <GroupMembers group={props.group} addedPerson={props.addedPerson} addedCallback={props.addedCallback} />; break;
      case "sessions": currentTab = <GroupSessions group={props.group} sidebarVisibilityFunction={props.sidebarVisibilityFunction} addedSession={props.addedSession} addedPerson={props.addedPerson} addedCallback={props.addedCallback} />; break;
      default: currentTab = <div>Not implemented</div>; break;
    }
    return currentTab
  }

  const getTabs = () => {
    if (props.group === null || props.group.id === undefined) return null;
    let tabs = [];
    let defaultTab = ""

    if (UserHelper.checkAccess(Permissions.membershipApi.groupMembers.view)) { tabs.push(getTab(0, "members", "people", "Members")); defaultTab = "members"; }
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view) && props.group?.trackAttendance) { tabs.push(getTab(1, "sessions", "calendar_month", "Sessions")); if (defaultTab === "") defaultTab = "sessions"; }
    if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);
    return tabs;
  }

  React.useEffect(() => { setVisibilityState() }, [selectedTab, setVisibilityState]);

  return (<Paper>
    <Box>
      <MaterialTabs value={tabIndex} style={{ borderBottom: "1px solid #CCC" }} data-cy="group-tabs">
        {getTabs()}
      </MaterialTabs>
      {getCurrentTab()}
    </Box>
  </Paper>);
}
