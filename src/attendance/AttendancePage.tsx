import React from "react";
import {
 Grid, Icon, Box, Typography, Button, Stack, Card, CardContent 
} from "@mui/material";
import { CalendarMonth as CalendarIcon, Group as GroupIcon, TrendingUp as TrendingIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { Locale, UserHelper, ApiHelper } from "@churchapps/apphelper";
import { AttendanceSetup } from "./components/AttendanceSetup";
import { Permissions } from "@churchapps/apphelper";
import { ReportWithFilter } from "../components";

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
      const [attendanceData, groupsData, groupServiceTimes] = await Promise.all([ApiHelper.get("/attendancerecords/tree", "AttendanceApi"), ApiHelper.get("/groups", "MembershipApi"), ApiHelper.get("/groupservicetimes", "AttendanceApi")]);

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
      {/* Enhanced Blue Header */}
      <Box
        sx={{
          backgroundColor: "var(--c1l2)",
          color: "#FFF",
          p: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
        <Stack spacing={2}>
          {/* Top Row: Title, Icon, and Tab Navigation */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }}>
            {/* Column 1: Title and Icon */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarIcon sx={{ fontSize: 32, color: "#FFF" }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                  }}
                >
                  {Locale.label("attendance.attendancePage.att")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  }}
                >
                  Track and manage church attendance across all services
                </Typography>
              </Box>
            </Stack>

            {/* Column 2: Tab Navigation */}
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
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Stack>
          </Stack>

          {/* Statistics Row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} flexWrap="wrap" useFlexGap justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Icon sx={{ color: "#FFF", fontSize: 20 }}>church</Icon>
              <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
                {stats.campuses}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
                Campuses
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarIcon sx={{ color: "#FFF", fontSize: 20 }} />
              <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
                {stats.serviceTimes}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
                Service Times
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Icon sx={{ color: "#FFF", fontSize: 20 }}>schedule</Icon>
              <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
                {stats.scheduledGroups}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
                Scheduled Groups
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Icon sx={{ color: "#FFF", fontSize: 20 }}>groups</Icon>
              <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
                {stats.unscheduledGroups}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
                Unscheduled Groups
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <GroupIcon sx={{ color: "#FFF", fontSize: 20 }} />
              <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
                {stats.totalGroups}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
                Total Groups
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3} sx={{ px: { xs: 2, md: 3 } }}>
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
    </>
  );
};
