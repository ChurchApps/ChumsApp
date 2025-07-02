import React from "react";
import { 
  Box, 
  Typography, 
  Stack, 
  Container, 
  Grid
} from "@mui/material";
import {
  Dashboard as DashboardIcon
} from "@mui/icons-material";
import { TaskList } from "../tasks/components/TaskList";
import { PeopleSearch } from "./components";
import { Groups } from "../people/components";
import { UserHelper } from "@churchapps/apphelper";
import { Locale } from "@churchapps/apphelper";

export const DashboardPage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <DashboardIcon 
              sx={{ 
                fontSize: 32, 
                color: 'primary.main' 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary' 
              }}
            >
              Chums {Locale.label("dashboard.dashboardPage.dash")}
            </Typography>
          </Stack>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ maxWidth: 800 }}
          >
            Welcome to your church management dashboard. Search for people, view your groups, and manage your open tasks.
          </Typography>
        </Box>

        {/* Dashboard Content */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <PeopleSearch />
              <Groups 
                personId={UserHelper.person?.id} 
                title={Locale.label("dashboard.myGroups")} 
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TaskList 
              compact={true} 
              status={Locale.label("tasks.taskPage.open")} 
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

