import React, { useRef } from "react";
import { ApiHelper, ArrayHelper, DisplayBox, Loading, ReportInterface, ReportResultInterface } from "../../components";
import { useReactToPrint } from "react-to-print";

interface Props { report: ReportInterface }

export const ReportOutput = (props: Props) => {
  const [reportResult, setReportResult] = React.useState<ReportResultInterface>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current
  })

  const runReport = () => {
    if (props.report) {
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
        const parts = c.value.split(".");
        const field = parts[1];
        row.push(<td>{d[field]}</td>);
      })
      result.push(<tr>{row}</tr>);
    });
    return result;
  }

  const getEditContent = () => {
    const result: JSX.Element[] = [];

    if (reportResult) {
      result.push(<button type="button" className="no-default-style" key={result.length - 2} onClick={handlePrint} title="print"><i className="fas fa-print"></i></button>);
      //result.push(<ExportLink key={result.length - 1} data={reportResult.tables[0].data} filename={props.report.displayName.replace(" ", "_") + ".csv"} />);
    }
    return result;
  }

  const getResults = () => {
    if (!props.report) return <p>Use the filter to run the report.</p>
    else if (!reportResult) return <Loading />
    else {
      return (<DisplayBox ref={contentRef} id="reportsBox" headerIcon="fas fa-table" headerText={props.report.displayName} editContent={getEditContent()}>
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
      {getResults()}
    </>
  );
}
