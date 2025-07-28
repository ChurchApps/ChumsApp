import React from "react";
import { Box, Stack, Container, Grid } from "@mui/material";
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { TaskList } from "../tasks/components/TaskList";
import { PeopleSearch } from "./components";
import { Groups } from "../people/components";
import { UserHelper, Locale, PageHeader } from "@churchapps/apphelper";

export const DashboardPage = () => {
  return (
    <>
      <PageHeader
        icon={<DashboardIcon />}
        title={`Chums ${Locale.label("dashboard.dashboardPage.dash")}`}
        subtitle="Welcome to your church management dashboard. Search for people, view your groups, and manage your open tasks."
      />

      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          {/* Dashboard Content */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                <PeopleSearch />
                <Groups personId={UserHelper.person?.id} title={Locale.label("dashboard.myGroups")} />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TaskList compact={true} status={Locale.label("tasks.taskPage.open")} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};
