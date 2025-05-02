import React from "react";
import { ReportWithFilter, Permissions, UserHelper } from "@churchapps/apphelper";
import { Box, Paper, Tabs as MaterialTabs, Tab } from "@mui/material";
import { useAppTranslation } from "../../contexts/TranslationContext";

export const Tabs: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);
  const { t } = useAppTranslation();

  const getTab = (index: number, keyName: string, icon: string, text: string) => (
    <Tab key={index} style={{ textTransform: "none", color: "#000" }} onClick={() => { setSelectedTab(keyName); setTabIndex(index); }} label={<>{text}</>} />
  )

  let tabs = [];
  let defaultTab = "setup";
  let currentTab = null;
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push(getTab(0, "attendance", "calendar_month", t("attendance.tabs.attTrend"))); if (defaultTab === "") defaultTab = "attendance"; }
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push(getTab(1, "groups", "person", t("attendance.tabs.groupAtt"))); if (defaultTab === "") defaultTab = "groups"; }
  if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

  switch (selectedTab) {
    case "attendance": currentTab = <ReportWithFilter keyName="attendanceTrend" autoRun={true} />; break;
    case "groups": currentTab = <ReportWithFilter keyName="groupAttendance" autoRun={true} />; break;
    default: currentTab = <div>{t("attendance.tabs.noImplement")}</div>; break;
  }

  return (<Paper>
    <Box>
      <MaterialTabs value={tabIndex} style={{ borderBottom: "1px solid #CCC" }} data-cy="group-tabs">
        {tabs}
      </MaterialTabs>
      {currentTab}
    </Box>
  </Paper>);
}
