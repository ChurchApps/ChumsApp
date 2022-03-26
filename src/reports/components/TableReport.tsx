import React from "react";
import { ArrayHelper, ColumnInterface, DateHelper, ReportOutputInterface, ReportResultInterface } from "../../components";

interface Props { reportResult: ReportResultInterface, output: ReportOutputInterface }

export const TableReport = (props: Props) => {

  const getHeaders = () => {
    const result: JSX.Element[] = []
    props.output.columns.forEach(c => {
      result.push(<th>{c.header}</th>);
    })
    return result;
  }

  const getRows = () => {
    const result: JSX.Element[] = []
    props.reportResult.table.forEach(d => {
      const row: JSX.Element[] = [];
      props.output.columns.forEach(c => {
        row.push(<td>{getField(c, d)}</td>);
      })
      result.push(<tr>{row}</tr>);
    });
    return result;
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


  return (
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
  );
}
