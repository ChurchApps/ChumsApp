import React from "react";
import { FormControl, InputLabel, Menu, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ApiHelper, DateHelper, InputBox } from "@churchapps/apphelper";
import { PlanInterface } from "../../helpers";

interface Props { plan: PlanInterface, plans:PlanInterface[], updatedFunction: () => void }

export const PlanEdit = (props:Props) => {

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
    }
    setPlan(p);
  }

  const validate = () => {
    const result = [];
    if (!plan.name) result.push("Plan name is required.");
    if (!plan.serviceDate) result.push("Service date is required.");
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
    <InputBox headerText={(plan.id) ? "Edit Plan" : "Add a Plan"} headerIcon="assignment" saveFunction={handleSave} cancelFunction={props.updatedFunction} deleteFunction={(plan.id) ? handleDelete : null }>
      <TextField fullWidth label="Name" id="name" name="name" type="text" value={plan.name} onChange={handleChange} />
      <TextField fullWidth label="Service Date" id="serviceDate" name="serviceDate" type="date" value={DateHelper.formatHtml5Date(plan.serviceDate)} onChange={handleChange} />
      <FormControl fullWidth>
        <InputLabel id="copyFrom">Copy From:</InputLabel>
        <Select name="copyFrom" labelId="copyFrom" label="Copy From" value={copyFromId} onChange={handleChange}>
          <MenuItem value="none">None</MenuItem>
          {getCopyOptions()}
        </Select>
      </FormControl>
    </InputBox>
  </>);
}

