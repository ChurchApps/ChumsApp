import React from "react";
import { useParams } from "react-router-dom";
import { ReportWithFilter, type ReportInterface, ApiHelper, Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";

export const ReportPage = () => {
  const params = useParams();
  const [report, setReport] = React.useState<ReportInterface>(null);
  const loadData = () => { ApiHelper.get("/reports/" + params.keyName, "ReportingApi").then(data => setReport(data)); }

  React.useEffect(loadData, [params.keyName]);

  return (
    <>
      <Banner><h1>{report?.displayName || Locale.label("serverAdmin.reportPage.report")}</h1></Banner>
      <div id="mainContent">
        <ReportWithFilter keyName={params.keyName} autoRun={false} />
      </div>
    </>
  );
}
