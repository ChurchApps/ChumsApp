import React from "react";
import { Permissions, UserHelper, Locale } from "@churchapps/apphelper";
import { Box, Paper, Tabs as MaterialTabs, Tab } from "@mui/material";
import { ReportWithFilter } from "../../components/reporting";

export const Tabs: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);

  // Determine a sensible default tab based on access
  const defaultTab = React.useMemo(() => {
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) return "attendance";
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) return "groups";
    return "setup";
  }, []);

  // Initialize selected tab via effect to avoid state updates during render
  React.useEffect(() => {
    if (!selectedTab && defaultTab) setSelectedTab(defaultTab);
  }, [selectedTab, defaultTab]);

  const getTab = (index: number, keyName: string, icon: string, text: string) => (
    <Tab
      key={index}
      style={{ textTransform: "none", color: "#000" }}
      onClick={() => {
        setSelectedTab(keyName);
        setTabIndex(index);
      }}
      label={<>{text}</>}
    />
  );

  const tabs = [];
  let currentTab = null;
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) {
    tabs.push(getTab(0, "attendance", "calendar_month", Locale.label("attendance.tabs.attTrend")));
  }
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) {
    tabs.push(getTab(1, "groups", "person", Locale.label("attendance.tabs.groupAtt")));
  }

  switch (selectedTab) {
    case "attendance":
      currentTab = <ReportWithFilter keyName="attendanceTrend" autoRun={true} />;
      break;
    case "groups":
      currentTab = <ReportWithFilter keyName="groupAttendance" autoRun={true} />;
      break;
    default:
      currentTab = <div>{Locale.label("attendance.tabs.noImplement")}</div>;
      break;
  }

  return (
    <Paper>
      <Box>
        <MaterialTabs value={tabIndex} style={{ borderBottom: "1px solid #CCC" }} data-cy="group-tabs">
          {tabs}
        </MaterialTabs>
        {currentTab}
      </Box>
    </Paper>
  );
};
