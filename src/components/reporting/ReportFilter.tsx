"use client";

import React from "react";
import type { ReportInterface, ParameterInterface } from "@churchapps/helpers";
import { ArrayHelper, Locale } from "../../helpers";
import { InputBox } from "../";
import { ReportFilterField } from "./ReportFilterField";

interface Props { report: ReportInterface, onChange: (report: ReportInterface) => void, onRun: () => void }

export const ReportFilter = (props: Props) => {

  const handleChange = (parameter: ParameterInterface, permittedChildIds: string[]) => {
    const r = { ...props.report };
    const p: ParameterInterface = ArrayHelper.getOne(r.parameters, "keyName", parameter.keyName);
    p.value = parameter.value;
    updateChildIds(r, p, permittedChildIds);
    props.onChange(r);
  };

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
  };

  const setRequiredParentIds = (report: ReportInterface, childSourceKey: string, requiredParentIds: string[]) => {
    const child: ParameterInterface = ArrayHelper.getOne(report.parameters, "sourceKey", childSourceKey);
    if (child) child.requiredParentIds = requiredParentIds;
  };

  const getInputs = () => {
    const result: React.ReactElement[] = [];
    props.report.parameters.forEach((p, i) => {
      if (p.source === "dropdown" || p.source === "date") {
        result.push(<ReportFilterField key={i} parameter={p} report={props.report} onChange={handleChange} />);
      }
    });
    return result;
  };

  const inputs = getInputs();
  if (inputs.length > 0) {
    return <InputBox id="formSubmissionBox" headerText="Filter Report" headerIcon="summarize" saveFunction={props.onRun} saveText={Locale.label("reporting.runReport")}>
      {inputs}
    </InputBox>;
  } else return <> </>;
};
