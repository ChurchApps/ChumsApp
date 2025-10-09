import React from "react";
import {
  Grid, Icon, Box, Card, CardContent, Container
} from "@mui/material";
import { CalendarMonth as CalendarIcon, Group as GroupIcon } from "@mui/icons-material";
import { Locale, UserHelper, ApiHelper, PageHeader } from "@churchapps/apphelper";
import { AttendanceSetup } from "./components/AttendanceSetup";
import { AttendanceNavigation } from "./components/AttendanceNavigation";
import { Permissions } from "@churchapps/apphelper";
import { ReportWithFilter } from "../components/reporting";

export const AttendancePage = () => {
  const [selectedTab, setSelectedTab] = React.useState("setup");
  const [stats, setStats] = React.useState({
    campuses: 0,
    serviceTimes: 0,
    scheduledGroups: 0,
    unscheduledGroups: 0,
    totalGroups: 0,
  });

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
        ]}
      />
      <AttendanceNavigation selectedTab={selectedTab} onTabChange={setSelectedTab} />

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
