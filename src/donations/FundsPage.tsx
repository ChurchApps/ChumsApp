import React from "react";
import { BatchEdit, Funds, DonationEvents } from "./components";
import { ApiHelper, DisplayBox, DateHelper, UserHelper, ExportLink, Loading, CurrencyHelper, SmallButton, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { ReportWithFilter, useMountedState, DonationBatchInterface, Permissions } from "@churchapps/apphelper";
import { Grid, Icon, Table, TableBody, TableCell, TableRow, TableHead, Paper } from "@mui/material"
import { Banner } from "../baseComponents/Banner";

export const FundsPage = () => {



  if (!UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) return (<></>);
  else return (
    <>
      <Banner><h1>{Locale.label("donations.donations.funds")}</h1></Banner>
      <div id="mainContent">
        <Funds />
      </div>
    </>
  );
}
