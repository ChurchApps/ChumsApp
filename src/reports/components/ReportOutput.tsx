import React, { useRef } from "react";
import { ApiHelper, DisplayBox, ExportLink, Loading, ReportInterface, ReportResultInterface } from "../../components";
import { useReactToPrint } from "react-to-print";
import { TableReport } from "./TableReport";
import { ChartReport } from "./ChartReport";
import { TreeReport } from "./TreeReport";

interface Props { report: ReportInterface }

export const ReportOutput = (props: Props) => {
  const [reportResult, setReportResult] = React.useState<ReportResultInterface>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current
  })

  const runReport = () => {
    if (props.report) {
      console.log("RUNNING: " + props.report.displayName)
      const queryParams: string[] = [];
      props.report.parameters.forEach(p => {
        if (p.value) queryParams.push(p.keyName + "=" + p.value);
      });
      let url = "/reports/" + props.report.keyName + "/run";
      if (queryParams) url += "?" + queryParams.join("&");

      ApiHelper.get(url, "ReportingApi").then((data: ReportResultInterface) => setReportResult(data));
    }
  }

  React.useEffect(runReport, [props.report]);

  const getEditContent = () => {
    const result: JSX.Element[] = [];

    if (reportResult) {
      result.push(<button type="button" className="no-default-style" key={result.length - 2} onClick={handlePrint} title="print"><i className="fas fa-print"></i></button>);
      result.push(<ExportLink key={result.length - 1} data={reportResult.table} filename={props.report.displayName.replace(" ", "_") + ".csv"} />);
    }
    return result;
  }

  const getOutputs = () => {
    const result: JSX.Element[] = [];
    reportResult.outputs.forEach(o => {
      if (o.outputType === "table") result.push(<TableReport reportResult={reportResult} output={o} />)
      if (o.outputType === "tree") result.push(<TreeReport reportResult={reportResult} output={o} />)
      else if (o.outputType === "barChart") result.push(<ChartReport reportResult={reportResult} output={o} />)
    })

    return result;
  }

  const getResults = () => {
    if (!props.report) return <p>Use the filter to run the report.</p>
    else if (!reportResult) return <Loading />
    else {
      return (<DisplayBox ref={contentRef} id="reportsBox" headerIcon="fas fa-table" headerText={props.report.displayName} editContent={getEditContent()}>
        {getOutputs()}
      </DisplayBox>);
    }
  }

  return (
    <>
      {getResults()}
    </>
  );
}
