import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
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
      if (c.field === "city") c.value = "";
      if (c.field === "gender") c.value = "Unknown";
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
    let result = "";
    switch (c.field) {
      case "gender": result = "Gender "; break;
      case "city": result = "City "; break;
      case "maritalStatus": result = "Marital status "; break;
      case "membershipStatus": result = "Membership status "; break;
    }

    let displayOperator = c.operator;
    if (displayOperator === "=") displayOperator = "is";
    else if (displayOperator === "!=") displayOperator = "is not";
    else if (displayOperator === "startsWith") displayOperator = "starts with";
    else if (displayOperator === "endsWith") displayOperator = "ends with";
    result += " " + displayOperator + " " + c.value;
    return result;
  }

  const getCity = () => (
    <TextField fullWidth type="text" label="City" value={props.condition.value || ""} name="value" onChange={handleChange} />
  )

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

  const getTextOperators = () => {
    return [
      <MenuItem key="/equals" value="=">=</MenuItem>,
      <MenuItem key="/contains" value="contains">contains</MenuItem>,
      <MenuItem key="/startsWith" value="startsWith">starts with</MenuItem>,
      <MenuItem key="/endsWith" value="endsWith">ends with</MenuItem>,
      <MenuItem key="/greaterThan" value=">">&gt;</MenuItem>,
      <MenuItem key="/greaterThanEqual" value=">=">&gt;=</MenuItem>,
      <MenuItem key="/lessThan" value="<">&lt;</MenuItem>,
      <MenuItem key="/lessThanEqual" value="<=">&lt;=</MenuItem>,
      <MenuItem key="/notEquals" value="!=">!=</MenuItem>,
    ]
  }

  const getDropDownOperators = () => {
    return [
      <MenuItem value="=">is</MenuItem>,
      <MenuItem value="!=">is not</MenuItem>
    ]
  }

  const getOperators = () => {
    let result: JSX.Element[] = []
    switch (props.condition.field) {
      case "city":
        result = getTextOperators();
        break;
      case "gender":
      case "maritalStatus":
      case "membershipStatus":
        result = getDropDownOperators();
        break;
    }
    return result;
  }

  console.log(props.condition.operator)
  return <>
    <FormControl fullWidth>
      <InputLabel>Operator</InputLabel>
      <Select fullWidth label="Operator" value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        {getOperators()}
      </Select>
    </FormControl>
    {(props.condition.field === "city") && getCity()}
    {(props.condition.field === "gender") && getGender()}
    {(props.condition.field === "maritalStatus") && getMaritalStatus()}
    {(props.condition.field === "membershipStatus") && getMembershipStatus()}
  </>
}
