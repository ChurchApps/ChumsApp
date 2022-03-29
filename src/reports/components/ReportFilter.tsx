import React from "react";
import { ArrayHelper, ReportInterface, ParameterInterface, InputBox } from "../../components";
import { FormGroup, FormLabel } from "react-bootstrap";
import { ReportFilterField } from "./ReportFilterField";

interface Props { report: ReportInterface, onChange: (report: ReportInterface) => void, onRun: () => void }

export const ReportFilter = (props: Props) => {

  const handleChange = (parameter: ParameterInterface, permittedChildIds: string[]) => {
    const r = { ...props.report };
    const p: ParameterInterface = ArrayHelper.getOne(r.parameters, "keyName", parameter.keyName);
    p.value = parameter.value;
    updateChildIds(r, p, permittedChildIds)
    props.onChange(r);
  }

  const updateChildIds = (report: ReportInterface, parameter: ParameterInterface, permittedChildIds: string[]) => {
    switch (parameter.sourceKey) {
      case "campus":
        setRequiredParentIds(report, "service", permittedChildIds);
        break;
      case "service":
        setRequiredParentIds(report, "serviceTime", permittedChildIds);
        break;
      case "serviceTime":
        setRequiredParentIds(report, "group", permittedChildIds);
        break;
    }

  }

  const setRequiredParentIds = (report: ReportInterface, childSourceKey: string, requiredParentIds: string[]) => {
    console.log("SET REQUIRED")
    console.log(childSourceKey)
    console.log(requiredParentIds)
    const child: ParameterInterface = ArrayHelper.getOne(report.parameters, "sourceKey", childSourceKey);
    if (child) child.requiredParentIds = requiredParentIds;
  }

  const getInputs = () => {
    const result: JSX.Element[] = [];
    props.report.parameters.forEach(p => {
      if (p.source === "dropdown" || p.source === "date") {
        result.push(<FormGroup>
          <FormLabel>{p.displayName}</FormLabel>
          <ReportFilterField parameter={p} report={props.report} onChange={handleChange} />
        </FormGroup>)
      }
    });
    return result;
  }

  const inputs = getInputs();
  if (inputs.length > 0) {
    return <InputBox id="formSubmissionBox" headerText="Filter Report" headerIcon="fas fa-report" saveFunction={props.onRun} saveText="Run Report">
      {inputs}
    </InputBox>
  } else return <></>
}
