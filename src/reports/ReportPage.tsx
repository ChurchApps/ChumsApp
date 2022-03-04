import React from "react";
import { ApiHelper, ArrayHelper, InputBox, Loading, ParameterInterface, ReportInterface } from "../components";
import { Row, Col, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ReportOutput } from "./components";

export const ReportPage = () => {
  const params = useParams();
  const [report, setReport] = React.useState<ReportInterface>(null);
  const [reportToRun, setReportToRun] = React.useState<ReportInterface>(null);

  const loadData = () => { ApiHelper.get("/reports/" + params.keyName, "ReportingApi").then(data => setReport(data)); }

  React.useEffect(loadData, [params.keyName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const r = { ...report };
    const p: ParameterInterface = ArrayHelper.getOne(r.parameters, "keyName", e.currentTarget.name);
    p.value = e.currentTarget.value;
    setReport(r);
  }

  const getInputs = () => {
    const result: JSX.Element[] = [];
    report.parameters.forEach(p => {
      if (p.source === "dropdown") {
        result.push(<FormGroup>
          <FormLabel>{p.displayName}</FormLabel>
          <FormControl as="select" value={p.value} onChange={handleChange} name={p.keyName} >
            {getSelectOptions(p)}
          </FormControl>
        </FormGroup>)
      }
    });
    return result;
  }

  const getSelectOptions = (p: ParameterInterface) => {
    const result: JSX.Element[] = [];
    p.options.forEach(o => {
      result.push(<option value={o.value}>{o.text}</option>)
    });
    return result;
  }

  const getInputBox = () => {
    const inputs = getInputs();
    if (inputs.length > 0) {
      return <InputBox id="formSubmissionBox" headerText="Form Fields" headerIcon="fas fa-report" saveFunction={handleRun} saveText="Run Report">
        {inputs}
      </InputBox>
    }
  }

  const handleRun = () => {
    setReportToRun(report);
  }

  const getContent = () => {
    if (!report) return <Loading />
    else return (<Row>
      <Col lg={8}>
        <ReportOutput report={reportToRun} />
      </Col>
      <Col lg={4}>
        {getInputBox()}
      </Col>
    </Row>)
  }

  return (
    <>
      <h1><i className="fas fa-table"></i> {report?.displayName}</h1>
      {getContent()}

    </>
  );
}
