import React from "react";
import { BatchEdit, Funds, DonationEvents } from "./components";
import { ApiHelper, DisplayBox, DateHelper, UserHelper, ExportLink, Loading, CurrencyHelper, SmallButton } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { ReportWithFilter, useMountedState, DonationBatchInterface, Permissions } from "@churchapps/apphelper";
import { Grid, Icon, Table, TableBody, TableCell, TableRow, TableHead, Paper } from "@mui/material"

export const DonationsPage = () => {
  const [editBatchId, setEditBatchId] = React.useState("notset");
  const [batches, setBatches] = React.useState<DonationBatchInterface[]>(null);
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
    result.push(<Funds key={result.length - 1} />);
    return result;
  }

  const getRows = () => {
    const result: JSX.Element[] = [];

    if (batches.length === 0) {
      result.push(<TableRow key="0">No batches found.</TableRow>)
      return result;
    }

    let canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
    let canViewBatcht = UserHelper.checkAccess(Permissions.givingApi.donations.view);
    for (let i = 0; i < batches.length; i++) {
      let b = batches[i];
      const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-${i}`} data-id={b.id} onClick={showEditBatch}><Icon>edit</Icon></a>) : null;
      const batchLink = (canViewBatcht) ? (<Link to={"/donations/" + b.id}>{b.name}</Link>) : <>{b.name}</>;
      result.push(<TableRow key={i}>
        <TableCell>{batchLink}</TableCell>
        <TableCell>{DateHelper.prettyDate(new Date(b.batchDate))}</TableCell>
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

    rows.push(<TableRow sx={{textAlign: "left"}} key="header"><th>Name</th><th>Date</th><th>Donations</th><th>Total</th><th>Edit</th></TableRow>);
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
      <h1><Icon>volunteer_activism</Icon> Donations</h1>
      <ReportWithFilter keyName="donationSummary" autoRun={true} />
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox id="batchesBox" data-cy="batches-box" headerIcon="volunteer_activism" headerText="Batches" editContent={getEditContent()} help="chums/manual-input">
            {getTable()}
          </DisplayBox>
          <DonationEvents />
        </Grid>
        <Grid item md={4} xs={12}>{getSidebarModules()}</Grid>
      </Grid>
    </>
  );
}
