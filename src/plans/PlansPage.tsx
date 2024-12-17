import React from "react";
import { Grid, Icon } from "@mui/material";
import { MinistryList } from "./components/MinistryList";
import { Locale } from "@churchapps/apphelper";
import { Banner } from "../baseComponents/Banner";

export const PlansPage = () => {

  const a=true;

  return (<>
    <Banner><h1>{Locale.label("plans.plansPage.selMin")}</h1></Banner>
    <div id="mainContent">
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <MinistryList />
        </Grid>
        <Grid item md={4} xs={12}>

        </Grid>
      </Grid>
    </div>
  </>);
}

