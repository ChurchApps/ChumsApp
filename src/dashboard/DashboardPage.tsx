import React from "react";
import { Grid, Icon } from "@mui/material";
import { TaskList } from "../tasks/components/TaskList";
import { PeopleSearch, UserHelper } from "./components";
import { Groups } from "../people/components";

export const DashboardPage = () => {
  return (<>
    <h1><Icon>home</Icon> Chums Dashboard</h1>
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <PeopleSearch />
        <Groups personId={UserHelper.person?.id} title="My Groups" />
      </Grid>
      <Grid item md={4} xs={12}>
        <TaskList compact={true} status="Open" />
      </Grid>
    </Grid>
  </>)
};

