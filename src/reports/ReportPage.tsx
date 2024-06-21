import React from "react";
import { useParams } from "react-router-dom";
import { ReportWithFilter, ReportInterface, ApiHelper, Locale } from "@churchapps/apphelper";
import { Icon } from "@mui/material";

export const ReportPage = () => {
  const params = useParams();
  const [report, setReport] = React.useState<ReportInterface>(null);
  const loadData = () => { ApiHelper.get("/reports/" + params.keyName, "ReportingApi").then(data => setReport(data)); }

  React.useEffect(loadData, [params.keyName]);

  return (
    <>
      <h1><Icon>summarize</Icon> {report?.displayName || Locale.label("reports.reportPage.report")}</h1>
      <ReportWithFilter keyName={params.keyName} autoRun={false} />
    </>
  );
}
