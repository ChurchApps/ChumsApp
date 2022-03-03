import React from "react";
import { ApiHelper, ArrayHelper, DisplayBox, Loading, ReportResultInterface } from "../components";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

export const ReportPage = () => {
  const params = useParams();
  const [reportResult, setReportResult] = React.useState<ReportResultInterface>(null);

  const loadData = () => { ApiHelper.get("/reports/" + params.keyName + "/run", "ReportingApi").then(data => setReportResult(data)); }

  React.useEffect(loadData, [params.keyName]);

  const getHeaders = () => {
    const result: JSX.Element[] = []
    reportResult.columns.forEach(c => {
      result.push(<th>{c.header}</th>);
    })
    return result;
  }

  const getRows = () => {
    const result: JSX.Element[] = []

    const mainTable: { keyName: string, data: any[] } = ArrayHelper.getOne(reportResult.tables, "keyName", "main");

    console.log(mainTable);
    mainTable.data.forEach(d => {
      const row: JSX.Element[] = [];
      reportResult.columns.forEach(c => {
        const parts = c.value.split('.');
        //const tableName = parts[0];
        const field = parts[1];
        row.push(<td>{d[field]}</td>);
      })
      result.push(<tr>{row}</tr>);
    });
    return result;
  }

  const getResults = () => {
    if (!reportResult) return <Loading />
    else {
      return (<DisplayBox id="reportsBox" headerIcon="fas fa-table" headerText="Reports">
        <table className="table">
          <thead>
            <tr>
              {getHeaders()}
            </tr>
          </thead>
          <tbody>
            {getRows()}
          </tbody>
        </table>
      </DisplayBox>);
    }
  }

  return (
    <>
      <h1><i className="fas fa-table"></i> {reportResult?.displayName}</h1>
      <Row>
        <Col lg={8}>
          {getResults()}
        </Col>
      </Row>
    </>
  );
}
