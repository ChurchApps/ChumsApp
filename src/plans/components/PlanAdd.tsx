import React from "react";
import { TextField } from "@mui/material";
import { ApiHelper, DateHelper, InputBox } from "@churchapps/apphelper";
import { PlanInterface } from "../../helpers";

interface Props { plan: PlanInterface, updatedFunction: () => void }

export const PlanAdd = (props:Props) => {

  const [plan, setPlan] = React.useState<PlanInterface>(props.plan);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const p = { ...plan } as PlanInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "name": p.name = value; break;
      case "serviceDate": p.serviceDate = new Date(value); break;
    }
    setPlan(p);
  }

  const handleSave = () => {
    ApiHelper.post("/plans", [plan], "DoingApi").then(props.updatedFunction);
  }

  const handleDelete = () => {
    ApiHelper.delete("/plans/" + plan.id, "DoingApi").then(props.updatedFunction);
  }

  return (<>
    <InputBox headerText="Add a Plan" headerIcon="assignment" saveFunction={handleSave} cancelFunction={props.updatedFunction} deleteFunction={(plan.id) ? handleDelete : null }>
      <TextField fullWidth label="Name" id="name" name="name" type="text" value={plan.name} onChange={handleChange} />
      <TextField fullWidth label="Service Date" id="serviceDate" name="serviceDate" type="date" value={DateHelper.formatHtml5Date(plan.serviceDate)} onChange={handleChange} />
    </InputBox>
  </>);
}

