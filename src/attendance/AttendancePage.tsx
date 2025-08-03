import React from "react";
import {
  Grid, Icon, Box, Button, Stack, Card, CardContent, Container 
} from "@mui/material";
import { CalendarMonth as CalendarIcon, Group as GroupIcon, TrendingUp as TrendingIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { Locale, UserHelper, ApiHelper, PageHeader } from "@churchapps/apphelper";
import { AttendanceSetup } from "./components/AttendanceSetup";
import { Permissions } from "@churchapps/apphelper";
import { ReportWithFilter } from "../components/reporting";

export const AttendancePage = () => {
  const [selectedTab, setSelectedTab] = React.useState("");
  const [stats, setStats] = React.useState({
    campuses: 0,
    serviceTimes: 0,
    scheduledGroups: 0,
    unscheduledGroups: 0,
    totalGroups: 0,
  });

  let defaultTab = "setup";

  const getTabs = () => {
    const tabs: { key: string; icon: string; label: string }[] = [];
    tabs.push({ key: "setup", icon: "settings", label: Locale.label("attendance.tabs.setup") });
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) {
      tabs.push({ key: "attendance", icon: "calendar_month", label: Locale.label("attendance.tabs.attTrend") });
      if (defaultTab === "") defaultTab = "attendance";
    }
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) {
      tabs.push({ key: "groups", icon: "people", label: Locale.label("attendance.tabs.groupAtt") });
      if (defaultTab === "") defaultTab = "groups";
    }
    if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);
    return tabs;
  };

  const getCurrentTab = () => {
    let currentTab = null;
    switch (selectedTab) {
      case "setup":
        currentTab = <AttendanceSetup />;
        break;
      case "attendance":
        currentTab = <ReportWithFilter keyName="attendanceTrend" autoRun={true} />;
        break;
      case "groups":
        currentTab = <ReportWithFilter keyName="groupAttendance" autoRun={true} />;
        break;
    }
    return currentTab;
  };

  const loadStats = React.useCallback(async () => {
    try {
      const [attendanceData, groupsData, groupServiceTimes] = await Promise.all([
        ApiHelper.get("/attendancerecords/tree", "AttendanceApi"),
        ApiHelper.get("/groups", "MembershipApi"),
        ApiHelper.get("/groupservicetimes", "AttendanceApi"),
      ]);

      const campuses = new Set();
      let serviceTimes = 0;

      attendanceData.forEach((a: any) => {
        if (a.campus?.name) campuses.add(a.campus.name);
        if (a.serviceTime) serviceTimes++;
      });

      const trackingGroups = groupsData.filter((g: any) => g.trackAttendance);
      const assignedGroupIds = new Set(groupServiceTimes.map((gst: any) => gst.groupId));
      const scheduledGroups = trackingGroups.filter((g: any) => assignedGroupIds.has(g.id)).length;
      const unscheduledGroups = trackingGroups.filter((g: any) => !assignedGroupIds.has(g.id)).length;

      setStats({
        campuses: campuses.size,
        serviceTimes,
        scheduledGroups,
        unscheduledGroups,
        totalGroups: groupsData.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, []);

  React.useEffect(() => {
    loadStats();
  }, [loadStats]);

  const tabIcons = {
    setup: <SettingsIcon />,
    attendance: <TrendingIcon />,
    groups: <GroupIcon />,
  };

  return (
    <>
      <PageHeader
        icon={<CalendarIcon />}
        title={Locale.label("attendance.attendancePage.att")}
        subtitle="Track and manage church attendance across all services"
        statistics={[
          { icon: <Icon>church</Icon>, value: stats.campuses.toString(), label: "Campuses" },
          { icon: <CalendarIcon />, value: stats.serviceTimes.toString(), label: "Service Times" },
          { icon: <Icon>schedule</Icon>, value: stats.scheduledGroups.toString(), label: "Scheduled Groups" },
          { icon: <Icon>groups</Icon>, value: stats.unscheduledGroups.toString(), label: "Unscheduled Groups" },
          { icon: <GroupIcon />, value: stats.totalGroups.toString(), label: "Total Groups" },
        ]}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {getTabs().map((tab) => (
            <Button
              key={tab.key}
              variant={selectedTab === tab.key ? "contained" : "outlined"}
              startIcon={tabIcons[tab.key] || <Icon>{tab.icon}</Icon>}
              onClick={() => setSelectedTab(tab.key)}
              sx={{
                color: selectedTab === tab.key ? "#1565C0" : "#FFF",
                backgroundColor: selectedTab === tab.key ? "#FFF" : "transparent",
                borderColor: "rgba(255,255,255,0.3)",
                minWidth: "auto",
                px: 2,
                py: 1,
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: selectedTab === tab.key ? "#FFF" : "rgba(255,255,255,0.1)",
                  borderColor: "#FFF",
                },
              }}>
              {tab.label}
            </Button>
          ))}
        </Stack>
      </PageHeader>

      {/* Main Content */}
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              {selectedTab === "setup" ? (
                <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <CardContent sx={{ p: 0 }}>{getCurrentTab()}</CardContent>
                </Card>
              ) : (
                getCurrentTab()
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};
