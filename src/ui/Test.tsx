import React from "react";
import { Header } from "./components/Header";
import { PersonBanner } from "./components/PersonBanner";
import { Grid } from "@mui/material";
import { DisplayBox } from "@churchapps/apphelper";
import { PersonNav } from "./components/PersonNav";

export const UI = () => (
  <>
    <Header />
    <div style={{height:64}}></div>
    <PersonBanner />
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <PersonNav />
      </Grid>
      <Grid item xs={10} style={{padding:24}}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <DisplayBox headerText="Test" headerIcon="">
          content
            </DisplayBox>
          </Grid>
          <Grid item xs={4}>
            <DisplayBox headerText="Test" headerIcon="">
          content
            </DisplayBox>
          </Grid>
        </Grid>
      </Grid>

    </Grid>

  </>
)
