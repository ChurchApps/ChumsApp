import React from "react";
import { BatchEdit, DonationEvents } from "./components";
import { ApiHelper, DisplayBox, DateHelper, UserHelper, ExportLink, Loading, CurrencyHelper, SmallButton, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { useMountedState, DonationBatchInterface, Permissions } from "@churchapps/apphelper";
import {  Icon, Table, TableBody, TableCell, TableRow, TableHead, Paper } from "@mui/material"
import { Banner } from "@churchapps/apphelper";

export const DonationBatchesPage = () => {
  const [editBatchId, setEditBatchId] = React.useState("notset");
  const [batches, setBatches] = React.useState<DonationBatchInterface[]>(null);
  const [sortDirection, setSortDirection] = React.useState<boolean | null>(null);
  const [currentSortedCol, setCurrentSortedCol] = React.useState<string>("");
  const isMounted = useMountedState();

  const batchUpdated = () => { setEditBatchId("notset"); loadData(); }

  const showEditBatch = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let id = anchor.getAttribute("data-id");
    setEditBatchId(id);
  }

  const loadData = () => { ApiHelper.get("/donationbatches", "GivingApi").then(data => {
    if(isMounted()) {
      setBatches(data);
    }}); }

  const getEditContent = () => (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) ? (<><ExportLink data={batches} spaceAfter={true} filename="donationbatches.csv" /><SmallButton onClick={() => { setEditBatchId("") }} icon="add" /></>) : null

  const getSidebarModules = () => {
    let result = [];
    if (editBatchId !== "notset") result.push(<BatchEdit key={result.length - 1} batchId={editBatchId} updatedFunction={batchUpdated} />)
    return result;
  }

  const sortTable = (key: string, asc: boolean | null) => {
    let sortedBatches;
    if (asc === null) asc = false;
    setCurrentSortedCol(key);

    sortedBatches = batches.sort(function(a: any, b: any) {
      if (a[key] === null) return Infinity;

      if (key === "batchDate") {
        if (typeof new Date(a[key]).getMonth === "function") {
          return asc ? (new Date(a[key])?.getTime() - new Date(b[key])?.getTime()) : (new Date(b[key])?.getTime() - new Date(a[key])?.getTime());
        }
      }

      const parsedNum = parseInt(a[key]);
      if (!isNaN(parsedNum)) { return asc ? (a[key] - b[key]) : (b[key] - a[key]); }

      const valA = a[key].toUpperCase();
      const valB = b[key].toUpperCase();
      if (valA < valB) {
        return asc ? 1 : -1;
      }
      if (valA > valB) {
        return asc ? -1 : 1;
      }

      return 0;
    });
    setBatches(sortedBatches);
    setSortDirection(!asc);
  }

  const getSortArrows = (key: string) => (
    <div style={{ display: "flex" }}>
      <div style={{ marginTop: "5px" }} className={`${sortDirection && currentSortedCol === key ? "sortAscActive" : "sortAsc"}`}></div>
      <div style={{ marginTop: "14px" }} className={`${!sortDirection && currentSortedCol === key ? "sortDescActive" : "sortDesc"}`}></div>
    </div>
  )

  const getRows = () => {
    const result: JSX.Element[] = [];

    if (batches.length === 0) {
      result.push(<TableRow key="0">{Locale.label("donations.donationsPage.noBatch")}</TableRow>)
      return result;
    }

    let canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
    let canViewBatcht = UserHelper.checkAccess(Permissions.givingApi.donations.view);
    for (let i = 0; i < batches.length; i++) {
      let b = batches[i];
      const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-${i}`} data-id={b.id} onClick={showEditBatch}><Icon>edit</Icon></a>) : null;
      const batchLink = (canViewBatcht) ? (<Link to={"/donations/batches/" + b.id}>{b.name}</Link>) : <>{b.name}</>;

      const dateObj = new Date(b.batchDate);
      let tz = dateObj.getTimezoneOffset() * 60 * 1000; //get timeZoneOffset in ms
      const getDateTime = dateObj.getTime();
      let calcDate;
      if (tz > 0) {
        calcDate = new Date(getDateTime - tz);
      } else {
        calcDate = new Date(getDateTime + tz);
      }

      result.push(<TableRow key={i}>
        <TableCell>{batchLink}</TableCell>
        <TableCell>{DateHelper.prettyDate(calcDate)}</TableCell>
        <TableCell>{b.donationCount}</TableCell>
        <TableCell>{CurrencyHelper.formatCurrency(b.totalAmount)}</TableCell>
        <TableCell>{editLink}</TableCell>
      </TableRow>);
    }
    return result;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];

    if (batches.length === 0) {
      return rows;
    }

    rows.push(
      <TableRow sx={{textAlign: "left"}} key="header">
        <th onClick={() => sortTable("name", sortDirection)}>
          <span style={{ float: "left", paddingRight: "5px", cursor: "default" }}>{Locale.label("common.name")}</span>
          {getSortArrows("name")}
        </th>
        <th onClick={() => sortTable("batchDate", sortDirection)}>
          <span style={{ float: "left", paddingRight: "5px", cursor: "default" }}>{Locale.label("donations.donationsPage.date")}</span>
          {getSortArrows("batchDate")}
        </th>
        <th>{Locale.label("donations.donationsPage.don")}</th>
        <th>{Locale.label("donations.donationsPage.total")}</th>
        <th>{Locale.label("common.edit")}</th>
      </TableRow>
    );
    return rows;
  }

  React.useEffect(loadData, [isMounted]);

  const getTable = () => {
    if (!batches) return <Loading />
    else return (<Paper sx={{ width: "100%", overflowX: "auto" }}>
      <Table>
        <TableHead>{getTableHeader()}</TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </Paper>);
  }

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) return (<></>);
  else return (
    <>
      <Banner><h1>{Locale.label("donations.donations.batches")}</h1></Banner>
      <div id="mainContent">
        {getSidebarModules()}
        <DisplayBox id="batchesBox" data-cy="batches-box" headerIcon="volunteer_activism" headerText={Locale.label("donations.donationsPage.batch")} editContent={getEditContent()} help="chums/manual-input">
          {getTable()}
        </DisplayBox>
        <DonationEvents />

      </div>
    </>
  );
}
