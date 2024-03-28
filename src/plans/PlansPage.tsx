import React from "react";
import { Grid, Icon } from "@mui/material";
import { Link } from "react-router-dom";

export const PlansPage = () => (<>
  <h1><Icon>assignment</Icon> Service Plans</h1>
  <Grid container spacing={3}>
    <Grid item md={8} xs={12}>
      <Link to="/plans/1">Sample Plan</Link>
    </Grid>
    <Grid item md={4} xs={12}>

    </Grid>
  </Grid>
</>);

