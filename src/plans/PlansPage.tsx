import React, { useEffect } from "react";
import { Grid, Icon, Tabs as MaterialTabs, Tab } from "@mui/material";
import { PlanList } from "./components/PlanList";
import { TeamList } from "./components/TeamList";
import { MinistryList } from "./components/MinistryList";

export const PlansPage = () => {

  const a=true;

  return (<>
    <h1><Icon>assignment</Icon>Select a Ministry</h1>
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <MinistryList />
      </Grid>
      <Grid item md={4} xs={12}>

      </Grid>
    </Grid>

  </>);
}

