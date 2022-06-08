import React from "react";
import { DisplayBox } from "../components";
import { Grid, Icon } from "@mui/material"
import { Link } from "react-router-dom";
import { Wrapper } from "../components/Wrapper";

export const ReportsPage = () => {
  console.log("report page")
  return (
    <Wrapper pageTitle="Reports">
      <h1><Icon>summarize</Icon> Reports</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox id="reportsBox" headerIcon="summarize" headerText="Reports">
            <ul>
              <li><Link to="/reports/birthdays">Birthdays</Link></li>
              <li><Link to="/reports/attendanceTrend">Attendance Trend</Link></li>
              <li><Link to="/reports/groupAttendance">Group Attendance</Link></li>
              <li><Link to="/reports/dailyGroupAttendance">Daily Group Attendance</Link></li>
              <li><Link to="/reports/donationSummary">Donation Summary</Link></li>
            </ul>

          </DisplayBox>
        </Grid>
      </Grid>
    </Wrapper>
  );
}
