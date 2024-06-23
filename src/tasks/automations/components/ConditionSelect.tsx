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
      <InputLabel>{Locale.label("tasks.conditionSelect.gender")}</InputLabel>
      <Select fullWidth label={Locale.label("tasks.conditionSelect.gender")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Unknown">{Locale.label("tasks.conditionSelect.unknown")}</MenuItem>
        <MenuItem value="Male">{Locale.label("tasks.conditionSelect.male")}</MenuItem>
        <MenuItem value="Female">{Locale.label("tasks.conditionSelect.female")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getMaritalStatus = () => (
    <FormControl fullWidth>
      <InputLabel>{Locale.label("tasks.conditionSelect.marStat")}</InputLabel>
      <Select fullWidth label={Locale.label("tasks.conditionSelect.marStat")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Unknown">{Locale.label("tasks.conditionSelect.unknown")}</MenuItem>
        <MenuItem value="Single">{Locale.label("tasks.conditionSelect.single")}</MenuItem>
        <MenuItem value="Married">{Locale.label("tasks.conditionSelect.married")}</MenuItem>
        <MenuItem value="Divorced">{Locale.label("tasks.conditionSelect.divorced")}</MenuItem>
        <MenuItem value="Widowed">{Locale.label("tasks.conditionSelect.widowed")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getMembershipStatus = () => (
    <FormControl fullWidth>
      <InputLabel>{Locale.label("tasks.conditionSelect.memShipStat")}</InputLabel>
      <Select fullWidth label={Locale.label("tasks.conditionSelect.memShipStat")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Member">{Locale.label("tasks.conditionSelect.mem")}</MenuItem>
        <MenuItem value="Visitor">{Locale.label("tasks.conditionSelect.visitor")}</MenuItem>
        <MenuItem value="Staff">{Locale.label("tasks.conditionSelect.staff")}</MenuItem>
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
