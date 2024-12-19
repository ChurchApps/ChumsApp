import { ReportWithFilter, DisplayBox, Locale } from "@churchapps/apphelper";
import { Grid } from "@mui/material";
import React from "react";


export const UsageTrendsTab = () => (
  <>
    <ReportWithFilter keyName="usageTrends" autoRun={true} />
    <DisplayBox headerIcon="summarize" headerText={Locale.label("serverAdmin.adminPage.valueNotes")}>
      <ul>
        <li><b>Chums</b> - {Locale.label("serverAdmin.adminPage.noteOne")}</li>
        <li><b>B1</b> - {Locale.label("serverAdmin.adminPage.noteTwo")}</li>
        <li><b>Lessons</b> - {Locale.label("serverAdmin.adminPage.noteThree")}</li>
        <li><b>FreeShow</b> - {Locale.label("serverAdmin.adminPage.noteFour")}</li>
      </ul>
    </DisplayBox>

  </>
)

