import React from "react";
import { ArrayHelper, ReportInterface, ParameterInterface, InputBox } from "../../components";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";

interface Props { report: ReportInterface, onChange: (report: ReportInterface) => void, onRun: () => void }

export const ReportFilter = (props: Props) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const r = { ...props.report };
    const p: ParameterInterface = ArrayHelper.getOne(r.parameters, "keyName", e.currentTarget.name);
    p.value = e.currentTarget.value;
    props.onChange(r);
  }

  const getInputs = () => {
    const result: JSX.Element[] = [];
    props.report.parameters.forEach(p => {
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

  const inputs = getInputs();
  if (inputs.length > 0) {
    return <InputBox id="formSubmissionBox" headerText="Form Fields" headerIcon="fas fa-report" saveFunction={props.onRun} saveText="Run Report">
      {inputs}
    </InputBox>
  } else return <></>
}
