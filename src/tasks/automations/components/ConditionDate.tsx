import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React from "react";
import { ConditionInterface } from "../../components";
import { ConditionHelper } from "../../../helpers"

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionDate = (props: Props) => {
  const init = () => {
    const c = { ...props.condition };
    if (!c.value) {
      c.value = "";
      c.operator = "=";
      c.fieldData = JSON.stringify({ datePart: "full" });
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
      case "datePart":
        c.fieldData = JSON.stringify({ datePart: val });
        if (val === "dayOfWeek" || val === "month" || val === "dayOfMonth" || val === "years") c.value = "1";
        break;
    }
    c.label = ConditionHelper.getLabel(c);
    props.onChange(c);
  }

  const getDateField = () => {
    let label = ConditionHelper.getTitleCase(props.condition.field);
    return <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <TextField fullWidth type="date" value={props.condition.value || ""} name="value" onChange={handleChange} />
    </FormControl>
  }

  const getNumberField = () => {
    let label = ConditionHelper.getTitleCase(props.condition.field);
    return <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <TextField fullWidth type="number" value={props.condition.value || ""} name="value" onChange={handleChange} />
    </FormControl>
  }

  const getDayOfWeek = () => (
    <FormControl fullWidth>
      <InputLabel>Day of Week</InputLabel>
      <Select fullWidth label="Day of Week" value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="1">Sunday</MenuItem>
        <MenuItem value="2">Monday</MenuItem>
        <MenuItem value="3">Tuesday</MenuItem>
        <MenuItem value="4">Wednesday</MenuItem>
        <MenuItem value="5">Thursday</MenuItem>
        <MenuItem value="6">Friday</MenuItem>
        <MenuItem value="7">Saturday</MenuItem>
      </Select>
    </FormControl>
  )

  const getMonth = () => (
    <FormControl fullWidth>
      <InputLabel>Month</InputLabel>
      <Select fullWidth label="Month" value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="1">January</MenuItem>
        <MenuItem value="2">February</MenuItem>
        <MenuItem value="3">March</MenuItem>
        <MenuItem value="4">April</MenuItem>
        <MenuItem value="5">May</MenuItem>
        <MenuItem value="6">June</MenuItem>
        <MenuItem value="7">July</MenuItem>
        <MenuItem value="8">August</MenuItem>
        <MenuItem value="9">September</MenuItem>
        <MenuItem value="10">October</MenuItem>
        <MenuItem value="11">November</MenuItem>
        <MenuItem value="12">December</MenuItem>
      </Select>
    </FormControl>
  )

  const getField = () => {
    let result = getDateField();
    switch (fieldData?.datePart) {
      case "dayOfWeek": result = getDayOfWeek(); break;
      case "month": result = getMonth(); break;
      case "dayOfMonth":
      case "years":
        result = getNumberField();
        break;
    }

    return result;
  }

  const fieldData = (props.condition.fieldData) ? JSON.parse(props.condition.fieldData) : {}

  return <>
    <FormControl fullWidth>
      <InputLabel>Date Part</InputLabel>
      <Select fullWidth label="Date Part" value={fieldData.datePart || ""} name="datePart" onChange={handleChange}>
        <MenuItem key="/full" value="full">Full Date</MenuItem>
        <MenuItem key="/dayOfWeek" value="dayOfWeek">Day of Week</MenuItem>
        <MenuItem key="/dayOfMonth" value="dayOfMonth">Day of Month</MenuItem>
        <MenuItem key="/month" value="month">Month</MenuItem>
        <MenuItem key="/years" value="years">Years Elapsed</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>Operator</InputLabel>
      <Select fullWidth label="Operator" value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem key="/equals" value="=">=</MenuItem>
        <MenuItem key="/greaterThan" value=">">&gt;</MenuItem>
        <MenuItem key="/greaterThanEqual" value=">=">&gt;=</MenuItem>
        <MenuItem key="/lessThan" value="<">&lt;</MenuItem>
        <MenuItem key="/lessThanEqual" value="<=">&lt;=</MenuItem>
        <MenuItem key="/notEquals" value="!=">!=</MenuItem>
      </Select>
    </FormControl>
    {getField()}
  </>
}
