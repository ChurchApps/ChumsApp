"use client";

import React from "react";
import { ReportOutputInterface, ReportResultInterface } from "@churchapps/helpers";
import { Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";
import { ReportHelper } from "../../helpers/ReportHelper";

interface Props { reportResult: ReportResultInterface, output: ReportOutputInterface }

export const TableReport = (props: Props) => {

  const getHeaders = () => {
    const result: React.ReactElement[] = [];
    props.output.columns.forEach((c, i) => {
      result.push(<TableCell key={i} style={{ fontWeight:"bold" }}>{c.header}</TableCell>);
    });
    return result;
  };

  const getRows = () => {
    const result: React.ReactElement[] = [];
    props.reportResult.table.forEach(d => {
      const row: React.ReactElement[] = [];
      props.output.columns.forEach(c => {
        row.push(<TableCell>{ReportHelper.getField(c, d)}</TableCell>);
      });
      result.push(<TableRow>{row}</TableRow>);
    });
    return result;
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          {getHeaders()}
        </TableRow>
      </TableHead>
      <TableBody>
        {getRows()}
      </TableBody>
    </Table>
  );
};