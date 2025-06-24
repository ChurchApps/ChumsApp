import React from "react";
import { DisplayBox, Locale } from "@churchapps/apphelper";
import { Grid, Icon } from "@mui/material"
import { Link } from "react-router-dom";

export const ReportsPage = () => {
  console.log("report page")
  return (
    <>
      <h1><Icon>summarize</Icon> {Locale.label("reports.reportsPage.reports")}</h1>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <DisplayBox id="reportsBox" headerIcon="summarize" headerText={Locale.label("reports.reportsPage.reports")}>
            <ul>
              <li><Link to="/reports/birthdays">{Locale.label("reports.reportsPage.bDays")}</Link></li>
              <li><Link to="/reports/attendanceTrend">{Locale.label("reports.reportsPage.attTrend")}</Link></li>
              <li><Link to="/reports/groupAttendance">{Locale.label("reports.reportsPage.groupAtt")}</Link></li>
              <li><Link to="/reports/dailyGroupAttendance">{Locale.label("reports.reportsPage.dailyGroupAtt")}</Link></li>
              <li><Link to="/reports/donationSummary">{Locale.label("reports.reportsPage.donSum")}</Link></li>
            </ul>

          </DisplayBox>
        </Grid>
      </Grid>
    </>
  );
}
