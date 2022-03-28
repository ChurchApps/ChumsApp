import React from "react";
import { Chart } from "react-google-charts";
import { ColumnInterface, DateHelper, ReportOutputInterface, ReportResultInterface } from "../../helpers";

interface Props { reportResult: ReportResultInterface, output: ReportOutputInterface }

export const ChartReport = (props: Props) => {
  let rows: any = [];

  const getChartData = () => {
    if (props.output.columns.length === 2) return getSingleData();
    else return getMultiData();
  }

  const getHeaders = () => {
    const result: string[] = [];
    const uniqueValues: string[] = [];

    props.reportResult.table.forEach(d => {
      const val = getField(props.output.columns[1], d);
      if (uniqueValues.indexOf(val) === -1) uniqueValues.push(val);
    });

    result.push(props.output.columns[0].header);
    uniqueValues.forEach(v => result.push(v));

    return result;
  }

  const getHeaderIndex = (headers: string[], header: string) => {
    let result = -1;
    let i = 0;
    headers.forEach(h => {
      if (h === header) result = i;
      i++;
    })
    return result;
  }

  const transformData = (headers: string[]) => {
    const result: any[] = [];
    props.reportResult.table.forEach(d => {
      const firstVal = getField(props.output.columns[0], d);
      const secondVal = getField(props.output.columns[1], d);
      const headerIndex = getHeaderIndex(headers, secondVal);

      let row: any[] = []
      if (result.length === 0 || firstVal !== result[result.length - 1][0]) {
        row[0] = firstVal;
        for (let i = 1; i < headers.length; i++) row[i] = 0;
        result.push(row);
      } else row = result[result.length - 1];

      row[headerIndex] = parseFloat(d[props.output.columns[2].value]);
    });

    return result;
  }

  const getMultiData = () => {
    const headers = getHeaders();
    rows = [];
    rows.push(headers);
    transformData(headers).forEach(d => {
      rows.push(d);
    })

    return rows;
  }

  const getSingleData = () => {
    rows = [];
    rows.push([props.output.columns[0].header, props.output.columns[1].header]);
    props.reportResult.table.forEach(d => {
      rows.push([getField(props.output.columns[0], d), parseFloat(getField(props.output.columns[1], d))])
    });
    return rows;
  }

  const getField = (column: ColumnInterface, dataRow: any) => {
    let result = dataRow[column.value].toString() || "";

    switch (column.formatter) {
      case "date":
        let dt = new Date(result);
        result = DateHelper.prettyDate(dt);
        break;
    }
    return result;
  }

  let result = <p>There is no data to display</p>
  if (props.reportResult.table?.length > 0) result = (<Chart chartType="ColumnChart" data={getChartData()} width="100%" height="400px" options={{ height: 400, legend: { position: "top", maxLines: 3 }, bar: { groupWidth: "75%" }, isStacked: true }} />);

  return result;

}
