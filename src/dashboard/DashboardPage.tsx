import React from "react";
import { Grid } from "@mui/material";
import { TaskList } from "../tasks/components/TaskList";
import { PeopleSearch } from "./components";
import { Groups } from "../people/components";
import { UserHelper } from "@churchapps/apphelper";
import { Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";

export const DashboardPage = () => (<>
  <Banner><h1>Chums {Locale.label("dashboard.dashboardPage.dash")}</h1></Banner>
  <div id="mainContent">

    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <PeopleSearch />
        <Groups personId={UserHelper.person?.id} title={Locale.label("dashboard.myGroups")} />
      </Grid>
      <Grid item md={4} xs={12}>
        <TaskList compact={true} status={Locale.label("tasks.taskPage.open")} />
      </Grid>
    </Grid>
  </div>
</>);

