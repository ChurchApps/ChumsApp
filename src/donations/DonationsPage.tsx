import React from "react";
import { ApiHelper, DisplayBox, BatchEdit, DonationBatchInterface, DateHelper, Funds, UserHelper, ExportLink, DonationSummaryInterface, Permissions, Loading, DonationEvents, ArrayHelper, CurrencyHelper } from "./components";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import { ReportFilterInterface, ReportInterface } from "../appBase/interfaces/ReportInterfaces";
import { ReportWithFilter } from "../appBase/components/reporting/ReportWithFilter";

export const DonationsPage = () => {
  const [editBatchId, setEditBatchId] = React.useState("notset");
  const [batches, setBatches] = React.useState<DonationBatchInterface[]>(null);

  const getFilter = (): ReportFilterInterface => ({
    keyName: "donationSummaryFilter",
    fields: [
      { keyName: "startDate", displayName: "Start Date", dataType: "date", value: DateHelper.addDays(new Date(), -365) },
      { keyName: "endDate", displayName: "End Date", dataType: "date", value: new Date() }
    ]
  });

  const loadReport = async (filter: ReportFilterInterface) => {
    if (filter === null) return;
    const startDate = ArrayHelper.getOne(filter.fields, "keyName", "startDate").value;
    const endDate = ArrayHelper.getOne(filter.fields, "keyName", "endDate").value;

    return ApiHelper.get("/donations/summary?startDate=" + DateHelper.formatHtml5Date(startDate) + "&endDate=" + DateHelper.formatHtml5Date(endDate), "GivingApi").then((summary) => {
      const r: ReportInterface = {
        headings: [
          { name: "Week", field: "week" },
          { name: "Fund", field: "fundName" },
          { name: "Amount", field: "totalAmount" }
        ],
        groupings: ["week", "fundName"],
        data: convertSummaryToReportData(summary),
        title: "Donation Summary",
        keyName: "donationSummary",
        reportType: "Bar Chart"
      };
      return r;
    })
  }

  const convertSummaryToReportData = (summary: DonationSummaryInterface[]) => {
    const result: any[] = [];
    summary.forEach(s => {
      s.donations.forEach((d: any) => {
        result.push({
          week: DateHelper.prettyDate(new Date(s.week)),
          fundName: (d.fund === undefined) ? "none" : d.fund.name,
          totalAmount: d.totalAmount
        });
      });
    });
    return result;
  }

  const showAddBatch = (e: React.MouseEvent) => { e.preventDefault(); setEditBatchId(""); }
  const batchUpdated = () => { setEditBatchId("notset"); loadData(); }

  const showEditBatch = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let id = anchor.getAttribute("data-id");
    setEditBatchId(id);
  }

  const loadData = () => {
    ApiHelper.get("/donationbatches", "GivingApi").then(data => { setBatches(data); });
  }

  const getEditContent = () => (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) ? (<><ExportLink data={batches} spaceAfter={true} filename="donationbatches.csv" /><a href="about:blank" data-cy="add-batch" onClick={showAddBatch}><i className="fas fa-plus"></i></a></>) : null

  const getSidebarModules = () => {
    let result = [];
    if (editBatchId !== "notset") result.push(<BatchEdit key={result.length - 1} batchId={editBatchId} updatedFunction={batchUpdated} />)
    result.push(<Funds key={result.length - 1} />);
    return result;
  }

  const getRows = () => {
    const result: JSX.Element[] = [];

    if (batches.length === 0) {
      result.push(<tr key="0">No batches found.</tr>)
      return result;
    }

    let canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
    let canViewBatcht = UserHelper.checkAccess(Permissions.givingApi.donations.view);
    for (let i = 0; i < batches.length; i++) {
      let b = batches[i];
      const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-${i}`} data-id={b.id} onClick={showEditBatch}><i className="fas fa-pencil-alt" /></a>) : null;
      const batchLink = (canViewBatcht) ? (<Link to={"/donations/" + b.id}>{b.id}</Link>) : <>{b.id}</>;
      result.push(<tr key={i}>
        <td>{batchLink}</td>
        <td>{b.name}</td>
        <td>{DateHelper.prettyDate(b.batchDate)}</td>
        <td>{b.donationCount}</td>
        <td>{CurrencyHelper.formatCurrency(b.totalAmount)}</td>
        <td>{editLink}</td>
      </tr>);
    }
    return result;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];

    if (batches.length === 0) {
      return rows;
    }

    rows.push(<tr key="header"><th>Id</th><th>Name</th><th>Date</th><th>Donations</th><th>Total</th><th>Edit</th></tr>);
    return rows;
  }

  React.useEffect(loadData, []);

  const getTable = () => {
    if (!batches) return <Loading />
    else return (<Table>
      <thead>{getTableHeader()}</thead>
      <tbody>{getRows()}</tbody>
    </Table>);
  }

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) return (<></>);
  else return (
    <>
      <h1><i className="fas fa-hand-holding-usd"></i> Donations</h1>
      <ReportWithFilter fetchReport={loadReport} filter={getFilter()} />
      <Row>
        <Col lg={8}>
          <DisplayBox id="batchesBox" data-cy="batches-box" headerIcon="fas fa-hand-holding-usd" headerText="Batches" editContent={getEditContent()}>
            {getTable()}
          </DisplayBox>
          <DonationEvents></DonationEvents>
        </Col>
        <Col lg={4}>{getSidebarModules()}</Col>
      </Row>
    </>
  );
}
