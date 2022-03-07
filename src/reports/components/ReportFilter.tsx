import React from "react";
import { ArrayHelper, ReportInterface, ParameterInterface, InputBox, ServiceInterface } from "../../components";
import { FormGroup, FormLabel } from "react-bootstrap";
import { ReportFilterField } from ".";

interface Props { report: ReportInterface, onChange: (report: ReportInterface) => void, onRun: () => void }

export const ReportFilter = (props: Props) => {

  const handleChange = (parameter: ParameterInterface) => {
    const r = { ...props.report };
    const p: ParameterInterface = ArrayHelper.getOne(r.parameters, "keyName", parameter.keyName);
    p.value = parameter.value;
    props.onChange(r);
  }

  const getInputs = () => {
    const result: JSX.Element[] = [];
    props.report.parameters.forEach(p => {
      if (p.source === "dropdown") {
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
    return <InputBox id="formSubmissionBox" headerText="Form Fields" headerIcon="fas fa-report" saveFunction={props.onRun} saveText="Run Report">
      {inputs}
    </InputBox>
  } else return <></>
}
