import React from "react";
import { Chart } from "react-google-charts";
import { ArrayHelper, ColumnInterface, DateHelper, ReportOutputInterface, ReportResultInterface } from "../../helpers";


interface Props { reportResult: ReportResultInterface, output: ReportOutputInterface }

export const ChartReport = (props: Props) => {
  let rows: any = [];

  const getChartData = () => {
    const mainTable: { keyName: string, data: any[] } = ArrayHelper.getOne(props.reportResult.tables, "keyName", "main");
    rows = [];
    rows.push([props.output.columns[0].header, props.output.columns[0].header]);

    mainTable.data.forEach(d => {
      console.log(d);
      rows.push([getField(props.output.columns[0], d), parseFloat(getField(props.output.columns[1], d))])
    });
    console.log(rows);

    return rows;

  }

  const getField = (column: ColumnInterface, dataRow: any) => {
    const parts = column.value.split(".");
    const field = parts[1];
    let result = dataRow[field].toString() || "";

    switch (column.formatter) {
      case "date":
        let dt = new Date(result);
        result = DateHelper.prettyDate(dt);
        break;
    }
    return result;
  }

  /*
    When multiple grouping fields are provided, the second heading is a grouping and will be broken out into several columns on the report, replacing the third Value heading.
         Example: Input headings of ["Week", "Fund", "Amount"] could result in ["Week", "General Fund", "Van Fund", "Roof Fund"].
    */
  const getHeader = () => {


  }

  //const chartData = getChartData();

  let result = <></>
  //switch (props.report.reportType) {
  //case "Area Chart":
  //result = (<Chart chartType="AreaChart" data={getChartData()} width="100%" height="400px" options={{ height: 400, legend: { position: "top", maxLines: 3 }, bar: { groupWidth: "75%" }, isStacked: true }} />);
  //break;
  //default:
  result = (<Chart chartType="ColumnChart" data={getChartData()} width="100%" height="400px" options={{ height: 400, legend: { position: "top", maxLines: 3 }, bar: { groupWidth: "75%" }, isStacked: true }} />);
  //break;
  //}
  return result;


}
