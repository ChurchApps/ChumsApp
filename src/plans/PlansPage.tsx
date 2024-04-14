import React from "react";
import { Grid, Icon } from "@mui/material";
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

