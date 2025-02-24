import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ApiHelper, DateHelper, ErrorMessages, InputBox, Locale } from "@churchapps/apphelper";

interface Props { plan: PlanInterface, plans: PlanInterface[], updatedFunction: () => void }

export interface PlanInterface { id?: string, churchId?: string, name?: string, ministryId?: string, serviceDate?: Date, notes?: string, serviceOrder?: boolean }

export const PlanEdit = (props: Props) => {

  const [plan, setPlan] = React.useState<PlanInterface>(props.plan);
  const [copyFromId, setCopyFromId] = React.useState<string>("none");
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setErrors([]);
    const p = { ...plan } as PlanInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "name": p.name = value; break;
      case "serviceDate": p.serviceDate = new Date(value); break;
      case "copyFrom": setCopyFromId(value); break;
      case "serviceOrder": p.serviceOrder = value === "true"; break;
    }
    setPlan(p);
  }

  const validate = () => {
    const result = [];
    if (!plan.name) result.push(Locale.label("plans.planEdit.planReq"));
    if (!plan.serviceDate) result.push(Locale.label("plans.planEdit.servReq"));
    setErrors(result);
    return result.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      if (copyFromId === "none") ApiHelper.post("/plans", [plan], "DoingApi").then(props.updatedFunction);
      else ApiHelper.post("/plans/copy/" + copyFromId, plan, "DoingApi").then(props.updatedFunction);
    }
  }

  const handleDelete = () => {
    ApiHelper.delete("/plans/" + plan.id, "DoingApi").then(props.updatedFunction);
  }

  const getCopyOptions = () => {
    let options = [];
    for (let i = 0; i < props.plans.length; i++) options.push(<MenuItem key={i} value={props.plans[i].id}>{props.plans[i].name}</MenuItem>);
    return options;
  }

  return (<>
    <ErrorMessages errors={errors} />
    <InputBox headerText={(plan.id) ? Locale.label("plans.planEdit.planEdit") : Locale.label("plans.planEdit.planAdd")} headerIcon="assignment" saveFunction={handleSave} cancelFunction={props.updatedFunction} deleteFunction={(plan.id) ? handleDelete : null}>
      <TextField fullWidth label={Locale.label("common.name")} id="name" name="name" type="text" value={plan.name} onChange={handleChange} />
      <TextField fullWidth label={Locale.label("plans.planEdit.servDate")} id="serviceDate" name="serviceDate" type="date" value={DateHelper.formatHtml5Date(plan.serviceDate)} onChange={handleChange} />
      <FormControl fullWidth>
        <InputLabel id="copyFrom">{Locale.label("plans.planEdit.copy")}:</InputLabel>
        <Select name="copyFrom" labelId="copyFrom" label={Locale.label("plans.planEdit.copy")} value={copyFromId} onChange={handleChange}>
          <MenuItem value="none">{Locale.label("plans.planEdit.none")}</MenuItem>
          {getCopyOptions()}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="serviceOrder">{Locale.label("plans.planEdit.servOrder")}:</InputLabel>
        <Select name="serviceOrder" labelId="serviceOrder" label={Locale.label("plans.planEdit.servOrder")} value={plan.serviceOrder.toString() || "false"} onChange={handleChange}>
          <MenuItem value="true">{Locale.label("common.yes")}</MenuItem>
          <MenuItem value="false">{Locale.label("common.no")}</MenuItem>
        </Select>
      </FormControl>
    </InputBox>
  </>);
}

