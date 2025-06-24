import React from "react";
import { PersonBanner } from "./components/PersonBanner";
import { Grid } from "@mui/material";
import { DisplayBox } from "@churchapps/apphelper";
import { PersonNav } from "./components/PersonNav";
import { Wrapper } from "../components";

export const UI = () => (
  <Wrapper>

    <PersonBanner />
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 2 }}>
        <PersonNav />
      </Grid>
      <Grid size={{ xs: 12, md: 10 }} style={{padding:24}}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <DisplayBox headerText="Test" headerIcon="">
          content
            </DisplayBox>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DisplayBox headerText="Test" headerIcon="">
          content
            </DisplayBox>
          </Grid>
        </Grid>
      </Grid>

    </Grid>

  </Wrapper>
)
