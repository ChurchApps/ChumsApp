import React from "react";
import { Header } from "./components/Header";
import { PersonBanner } from "./components/PersonBanner";
import { Grid } from "@mui/material";
import { DisplayBox } from "@churchapps/apphelper";
import { PersonNav } from "./components/PersonNav";

export const UI = () => (
  <>
    <Header />

    <PersonBanner />
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <PersonNav />
      </Grid>
      <Grid item xs={12} md={10} style={{padding:24}}>
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <DisplayBox headerText="Test" headerIcon="">
          content
            </DisplayBox>
          </Grid>
          <Grid item md={4} xs={12}>
            <DisplayBox headerText="Test" headerIcon="">
          content
            </DisplayBox>
          </Grid>
        </Grid>
      </Grid>

    </Grid>

  </>
)
