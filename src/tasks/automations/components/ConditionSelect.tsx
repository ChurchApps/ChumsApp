import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ConditionHelper } from "../../components";
import { ConditionInterface, Locale } from "@churchapps/apphelper";

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
      <InputLabel>{Locale.label("person.gender")}</InputLabel>
      <Select fullWidth label={Locale.label("person.gender")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Unknown">{Locale.label("person.unknown")}</MenuItem>
        <MenuItem value="Male">{Locale.label("person.male")}</MenuItem>
        <MenuItem value="Female">{Locale.label("person.female")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getMaritalStatus = () => (
    <FormControl fullWidth>
      <InputLabel>{Locale.label("person.maritalStatus")}</InputLabel>
      <Select fullWidth label={Locale.label("person.maritalStatus")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Unknown">{Locale.label("person.unknown")}</MenuItem>
        <MenuItem value="Single">{Locale.label("person.single")}</MenuItem>
        <MenuItem value="Married">{Locale.label("person.married")}</MenuItem>
        <MenuItem value="Divorced">{Locale.label("person.divorced")}</MenuItem>
        <MenuItem value="Widowed">{Locale.label("person.widowed")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getMembershipStatus = () => (
    <FormControl fullWidth>
      <InputLabel>{Locale.label("person.membershipStatus")}</InputLabel>
      <Select fullWidth label={Locale.label("person.membershipStatus")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Visitor">{Locale.label("person.visitor")}</MenuItem>
        <MenuItem value="Regular Attendee">{Locale.label("person.regularAttendee")}</MenuItem>
        <MenuItem value="Member">{Locale.label("person.member")}</MenuItem>
        <MenuItem value="Staff">{Locale.label("person.staff")}</MenuItem>
        <MenuItem value="Inactive">{Locale.label("person.inactive")}</MenuItem>
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
      <InputLabel>{Locale.label("tasks.conditionSelect.op")}</InputLabel>
      <Select fullWidth label={Locale.label("tasks.conditionSelect.op")} value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem value="=">{Locale.label("tasks.conditionSelect.is")}</MenuItem>
        <MenuItem value="!=">{Locale.label("tasks.conditionSelect.isNot")}</MenuItem>
      </Select>
    </FormControl>
    {getValueField()}
  </>
}
