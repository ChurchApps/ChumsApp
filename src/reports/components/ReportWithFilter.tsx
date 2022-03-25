import React from "react";
import { ApiHelper, Loading, ReportInterface } from "../../components";
import { Row, Col } from "react-bootstrap";
import { ReportOutput } from "./ReportOutput"
import { ReportFilter } from "./ReportFilter"

interface Props { keyName: string, autoRun: boolean }

export const ReportWithFilter = (props: Props) => {
  const [report, setReport] = React.useState<ReportInterface>(null);
  const [reportToRun, setReportToRun] = React.useState<ReportInterface>(null);

  const loadData = () => { ApiHelper.get("/reports/" + props.keyName, "ReportingApi").then(data => setReport(data)); }

  const handleAutoRun = () => {
    if (props.autoRun && report) setReportToRun(report);
  }

  React.useEffect(loadData, [props.keyName]);
  React.useEffect(handleAutoRun, [report, props.autoRun]);

  const handleRun = () => { setReportToRun(report); }

  const handleChange = (r: ReportInterface) => setReport(r);

  if (!report) return <Loading />
  else {
    return (<Row>
      <Col lg={8}>
        <ReportOutput report={reportToRun} />
      </Col>
      <Col lg={4}>
        <ReportFilter report={report} onChange={handleChange} onRun={handleRun} />
      </Col>
    </Row>)
  }
}
