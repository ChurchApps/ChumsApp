import React from "react";
import { Grid, Icon } from "@mui/material";
import { TaskList } from "../tasks/components/TaskList";
import { PeopleSearch } from "./components";
import { Groups } from "../people/components";
import { UserHelper } from "@churchapps/apphelper";
import { Locale } from "@churchapps/apphelper";

export const DashboardPage = () => (<>
  <h1><Icon>home</Icon> Chums {Locale.label("dashboard.dashboardPage.dash")}</h1>
  <Grid container spacing={3}>
    <Grid item md={8} xs={12}>
      <PeopleSearch />
      <Groups personId={UserHelper.person?.id} title={Locale.label("dashboard.myGroups")} />
    </Grid>
    <Grid item md={4} xs={12}>
      <TaskList compact={true} status="Open" />
    </Grid>
  </Grid>
</>);

