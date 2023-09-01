import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ConditionHelper } from "../../components";
import { ConditionInterface } from "@churchapps/apphelper";

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionSelect = (props: Props) => {

  const init = () => {
    const c = { ...props.condition };
    if (!c.value) {
      c.value = "";
      if (c.field === "gender") c.value = "Unknown";
      if (c.field === "maritalStatus") c.value = "Unknown";
      if (c.field === "membershipStatus") c.value = "Visitor";
      c.operator = "=";
    }
    c.label = ConditionHelper.getLabel(c);
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
    c.label = ConditionHelper.getLabel(c);
    props.onChange(c);
  }

  const getGender = () => (
    <FormControl fullWidth>
      <InputLabel>Gender</InputLabel>
      <Select fullWidth label="Gender" value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Unknown">Unknown</MenuItem>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </Select>
    </FormControl>
  )

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

  const getValueField = () => {
    let result = <></>;
    switch (props.condition.field) {
      case "gender": result = getGender(); break;
      case "maritalStatus": result = getMaritalStatus(); break;
      case "membershipStatus": result = getMembershipStatus(); break;
    }
    return result;
  }

  console.log(props.condition.operator)
  return <>
    <FormControl fullWidth>
      <InputLabel>Operator</InputLabel>
      <Select fullWidth label="Operator" value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem value="=">is</MenuItem>
        <MenuItem value="!=">is not</MenuItem>
      </Select>
    </FormControl>
    {getValueField()}
  </>
}
