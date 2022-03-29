import React from "react";
import { ApiHelper, ReportInterface } from "../components";
import { useParams } from "react-router-dom";
import { ReportWithFilter } from "../appBase/components/reporting/ReportWithFilter";

export const ReportPage = () => {
  const params = useParams();
  const [report, setReport] = React.useState<ReportInterface>(null);
  const loadData = () => { ApiHelper.get("/reports/" + params.keyName, "ReportingApi").then(data => setReport(data)); }

  React.useEffect(loadData, [params.keyName]);

  return (
    <>
      <h1>{report?.displayName || "Report"}</h1>
      <ReportWithFilter keyName={params.keyName} autoRun={false} />
    </>
  );
}
