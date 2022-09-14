import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ConditionInterface } from "../../components";

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionPerson = (props: Props) => {

  const init = () => {
    const c = { ...props.condition };
    if (!c.value) {
      if (c.field === "maritalStatus") c.value = "Unknown";
      if (c.field === "membershipStatus") c.value = "Visitor";
      c.operator = "=";
    }
    c.label = getLabel(c);
    props.onChange(c);
  }

  React.useEffect(init, [props.condition.field]); //eslint-disable-line

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const c = { ...props.condition };
    const val = e.target.value;
    switch (e.target.name) {
      case "value":
        c.value = val;
        break;
      case "operator":
        c.operator = val;
        break;
    }
    c.label = getLabel(c);
    props.onChange(c);
  }

  const getLabel = (c: ConditionInterface) => {
    let result = (c.field === "maritalStatus") ? "Marital status is " : "Membership status is ";
    if (c.operator === "!=") result += "not ";
    result += c.value;
    return result;
  }

  const getMaritalStatus = () => (
    <FormControl fullWidth>
      <InputLabel>Marital Status</InputLabel>
      <Select fullWidth label="Marital Status" value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Unknown">Unknown</MenuItem>
        <MenuItem value="Single">Single</MenuItem>
        <MenuItem value="Married">Married</MenuItem>
        <MenuItem value="Divorced">Divorced</MenuItem>
        <MenuItem value="Widowed">Widowed</MenuItem>
      </Select>
    </FormControl>
  )

  const getMembershipStatus = () => (
    <FormControl fullWidth>
      <InputLabel>Membership Status</InputLabel>
      <Select fullWidth label="Membership Status" value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Member">Member</MenuItem>
        <MenuItem value="Visitor">Visitor</MenuItem>
        <MenuItem value="Staff">Staff</MenuItem>
      </Select>
    </FormControl>
  )

  return <>
    <FormControl fullWidth>
      <InputLabel>Operator</InputLabel>
      <Select fullWidth label="Marital Status" value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem value="=">is</MenuItem>
        <MenuItem value="!=">is not</MenuItem>
      </Select>
    </FormControl>
    {(props.condition.field === "maritalStatus") && getMaritalStatus()}
    {(props.condition.field === "membershipStatus") && getMembershipStatus()}
  </>
}
